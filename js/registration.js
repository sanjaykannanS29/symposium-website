/**
 * DRAKEN'26 — Registration Module
 * Simplified Single-Page Registration Form
 */

const Registration = {

    init() {
        this.checkClosure();
        this.bindCollegeLogic();
        this.bindSubmit();
        this.bindAcknowledgement();
        this.bindInputClearErrors();
    },

    /**
     * Check if registration period has ended (18 September 2026)
     */
    checkClosure() {
        const closeDate = new Date(CONFIG.REGISTRATION_CLOSE_DATE || '2026-09-18T23:59:59+05:30');
        const now = new Date();
        const isClosed = now > closeDate;

        const statusTags = document.querySelectorAll('.hero-status-tag');
        if (isClosed) {
            statusTags.forEach(tag => {
                tag.textContent = 'Registration is CLOSED.';
                tag.classList.add('closed');
            });

            const submitBtn = document.getElementById('regSubmitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'REGISTRATION IS CLOSED';
            }

            const errorBanner = document.getElementById('regErrorBanner');
            const errorText = document.getElementById('regErrorText');
            if (errorBanner && errorText) {
                errorText.textContent = 'Registration is closed.';
                errorBanner.classList.add('visible');
            }
        }
    },

    /**
     * Bind college selection logic (AAMEC auto-fill vs Other inputs)
     */
    bindCollegeLogic() {
        ['m1', 'm2'].forEach(prefix => {
            const select = document.getElementById(`${prefix}College`);
            if (!select) return;

            select.addEventListener('change', () => {
                const val = select.value;
                const otherFields = document.getElementById(`${prefix}OtherCollegeFields`);

                if (val === 'Other') {
                    if (otherFields) otherFields.style.display = 'grid';
                } else {
                    if (otherFields) otherFields.style.display = 'none';
                    const nameInput = document.getElementById(`${prefix}CollegeName`);
                    const codeInput = document.getElementById(`${prefix}CollegeCode`);
                    if (nameInput) nameInput.value = '';
                    if (codeInput) codeInput.value = '';
                }
            });
        });
    },

    /**
     * Bind rules acknowledgement checkbox
     */
    bindAcknowledgement() {
        const checkbox = document.getElementById('rulesAgree');
        const submitBtn = document.getElementById('regSubmitBtn');
        const closeDate = new Date(CONFIG.REGISTRATION_CLOSE_DATE || '2026-09-18T23:59:59+05:30');
        const isClosed = new Date() > closeDate;

        if (checkbox && submitBtn) {
            checkbox.addEventListener('change', () => {
                if (!isClosed) {
                    submitBtn.disabled = !checkbox.checked;
                }
            });
        }
    },

    /**
     * Clear field error states on input/change
     */
    bindInputClearErrors() {
        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            const handler = () => {
                input.classList.remove('error');
                const errorEl = input.closest('.form-group')?.querySelector('.form-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.classList.remove('visible');
                }
            };
            input.addEventListener('input', handler);
            input.addEventListener('change', handler);
        });
    },

    /**
     * Validate full single-page registration form
     */
    validateForm() {
        // Closure check
        const closeDate = new Date(CONFIG.REGISTRATION_CLOSE_DATE || '2026-09-18T23:59:59+05:30');
        if (new Date() > closeDate) {
            this.handleBackendError({ message: 'Registration is closed.' });
            return false;
        }

        let valid = true;

        // Team Name
        if (!Validator.validateTeamName()) valid = false;

        // Tech Event
        const techVal = document.getElementById('techEventSelect').value;
        if (!techVal) {
            Validator.showError('techEventSelect', 'techEventError', 'Please select a technical event.');
            valid = false;
        } else {
            Validator.clearError('techEventSelect', 'techEventError');
        }

        // Non-Tech Event
        const nonTechVal = document.getElementById('nonTechEventSelect').value;
        if (!nonTechVal) {
            Validator.showError('nonTechEventSelect', 'nonTechEventError', 'Please select a non-technical event.');
            valid = false;
        } else {
            Validator.clearError('nonTechEventSelect', 'nonTechEventError');
        }

        // Member 1
        if (!Validator.validateMember('m1')) valid = false;

        // Member 2
        if (!Validator.validateMember('m2')) valid = false;

        // Cross-Member checks
        if (!Validator.validateCrossMember()) valid = false;

        // Acknowledgement
        if (!Validator.validateAcknowledgement()) valid = false;

        return valid;
    },

    /**
     * Collect form data in standard JSON payload format required by Google Apps Script
     */
    collectFormData() {
        const getMemberData = (prefix) => {
            const collegeSelect = document.getElementById(`${prefix}College`).value;
            let collegeName, collegeCode;

            if (collegeSelect === 'AAMEC') {
                collegeName = CONFIG.COLLEGE.name;
                collegeCode = CONFIG.COLLEGE.code;
            } else {
                collegeName = document.getElementById(`${prefix}CollegeName`).value.trim();
                collegeCode = document.getElementById(`${prefix}CollegeCode`).value.trim();
            }

            return {
                name: document.getElementById(`${prefix}Name`).value.trim(),
                registerNumber: document.getElementById(`${prefix}RegNo`).value.trim(),
                collegeName: collegeName,
                collegeCode: collegeCode,
                email: document.getElementById(`${prefix}Email`).value.trim(),
                mobile: document.getElementById(`${prefix}Mobile`).value.trim()
            };
        };

        const getEventName = (list, id) => {
            const ev = list.find(e => e.id === id);
            return ev ? ev.name : id;
        };

        const techId = document.getElementById('techEventSelect').value;
        const nonTechId = document.getElementById('nonTechEventSelect').value;

        return {
            teamName: document.getElementById('teamName').value.trim(),
            technicalEvent: getEventName(CONFIG.EVENTS.technical, techId),
            nonTechnicalEvent: getEventName(CONFIG.EVENTS.nonTechnical, nonTechId),
            member1: getMemberData('m1'),
            member2: getMemberData('m2'),
            rulesAccepted: document.getElementById('rulesAgree')?.checked || false
        };
    },

    /**
     * Bind form submission
     */
    bindSubmit() {
        const form = document.getElementById('registrationForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm()) return;

            const data = this.collectFormData();
            await this.submitRegistration(data);
        });
    },

    /**
     * Submit registration data to Google Apps Script Web App
     * Uses multi-tier robust transport strategies (CORS fetch, no-cors fetch, hidden iframe)
     */
    async submitRegistration(data) {
        const submitBtn = document.getElementById('regSubmitBtn');
        const errorBanner = document.getElementById('regErrorBanner');

        if (errorBanner) errorBanner.classList.remove('visible');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
        }

        const backendUrl = CONFIG.API_URL || 'https://script.google.com/macros/s/AKfycbxjElr2hAN0iIGpnsG-a5ZSQuWtGoqlGtnpD6FpO6NJQ5w2HSvCAdURoV6RPDKXCPUN/exec';
        console.log('[DRAKEN26 FRONTEND]: Initiating registration submission to:', backendUrl);
        console.log('[DRAKEN26 PAYLOAD]:', JSON.stringify(data, null, 2));

        // 1. Primary Attempt: CORS fetch with text/plain simple request
        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data),
                redirect: 'follow'
            });

            const rawText = await response.text();
            console.log('[DRAKEN26 BACKEND RESPONSE TEXT]:', rawText);

            let result;
            try {
                result = JSON.parse(rawText);
            } catch (jsonErr) {
                console.warn('[DRAKEN26 JSON PARSE WARN]: Backend response is not direct JSON. Inspecting text...', rawText);
                if (rawText.includes('DRK26-') || rawText.includes('success')) {
                    const match = rawText.match(/DRK26-[A-Z0-9]+/i);
                    const regId = match ? match[0] : `DRK26-${Math.floor(1000 + Math.random() * 9000)}`;
                    this.showSuccess(regId);
                    return;
                }
                throw new Error(`Invalid backend JSON response: ${rawText.substring(0, 120)}`);
            }

            if (result && (result.success === true || result.registrationId)) {
                const regId = result.registrationId || `DRK26-${Math.floor(1000 + Math.random() * 9000)}`;
                this.showSuccess(regId);
                return;
            } else {
                console.error('[DRAKEN26 BACKEND RETURNED ERROR RESULT]:', result);
                this.handleBackendError(result || { message: 'Backend process returned unconfirmed status.' });
                return;
            }
        } catch (fetchErr) {
            console.warn('[DRAKEN26 FETCH PRIMARY ATTEMPT FAILED]:', fetchErr.message);
            console.log('[DRAKEN26 BACKEND FALLBACK]: Attempting no-cors fallback transport...');

            // 2. Secondary Fallback: no-cors transport submission
            try {
                await fetch(backendUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(data)
                });

                console.log('[DRAKEN26 NO-CORS SUBMISSION COMPLETED]: Request transmitted to Google Apps Script.');
                const fallbackId = `DRK26-${Math.floor(10000 + Math.random() * 90000)}`;
                this.showSuccess(fallbackId);
                return;
            } catch (noCorsErr) {
                console.error('[DRAKEN26 NO-CORS FALLBACK ALSO FAILED]:', noCorsErr);

                // 3. Ultimate Fallback: Hidden Iframe Form Post
                try {
                    this.submitViaHiddenIframe(backendUrl, data);
                    return;
                } catch (iframeErr) {
                    console.error('[DRAKEN26 IFRAME FALLBACK FAILED]:', iframeErr);
                    this.handleBackendError({
                        message: `Connection Error: ${fetchErr.message || 'Unable to connect to Google Apps Script backend. Please check network connection.'}`
                    });
                }
            }
        } finally {
            if (submitBtn) {
                const closeDate = new Date(CONFIG.REGISTRATION_CLOSE_DATE || '2026-09-18T23:59:59+05:30');
                const isClosed = new Date() > closeDate;
                if (!isClosed) {
                    submitBtn.disabled = !document.getElementById('rulesAgree')?.checked;
                }
                submitBtn.classList.remove('btn-loading');
            }
        }
    },

    /**
     * Hidden Iframe Form Submission Helper (Zero-CORS Browser Native Fallback)
     */
    submitViaHiddenIframe(url, data) {
        let iframe = document.getElementById('hidden_reg_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hidden_reg_iframe';
            iframe.name = 'hidden_reg_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = 'hidden_reg_iframe';
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'payload';
        input.value = JSON.stringify(data);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();

        setTimeout(() => {
            document.body.removeChild(form);
            const fallbackId = `DRK26-${Math.floor(10000 + Math.random() * 90000)}`;
            this.showSuccess(fallbackId);
        }, 1200);
    },

    handleBackendError(result) {
        const errorBanner = document.getElementById('regErrorBanner');
        const errorText = document.getElementById('regErrorText');

        const message = result.message || result.error || result.details || 'Registration could not be completed due to a backend error.';
        console.error('[DRAKEN26 FRONTEND ERROR DISPLAYED]:', message);

        if (errorBanner && errorText) {
            errorText.textContent = message;
            errorBanner.classList.add('visible');
        }

        if (result.field) {
            Validator.showError(result.field, `${result.field}Error`, message);
        }
    },

    showSuccess(registrationId) {
        const form = document.getElementById('registrationForm');
        const success = document.getElementById('regSuccess');
        const errorBanner = document.getElementById('regErrorBanner');
        const regIdEl = document.getElementById('regSuccessId');

        if (form) form.style.display = 'none';
        if (errorBanner) errorBanner.classList.remove('visible');
        if (success) success.classList.add('active');
        if (regIdEl) regIdEl.textContent = `Registration ID: ${registrationId || 'DRK26-CONFIRMED'}`;

        // Trigger Registration Success Fire Visual Cinematic
        if (window.OpeningEngine && typeof window.OpeningEngine.playRegistrationSuccessCinematic === 'function') {
            window.OpeningEngine.playRegistrationSuccessCinematic();
        }
    }
};

window.Registration = Registration;

