/**
 * DRAKEN'26 — Form Validation Utilities
 */

const Validator = {

    /**
     * Check if a string is non-empty after trimming
     */
    required(value) {
        return typeof value === 'string' && value.trim().length > 0;
    },

    /**
     * Validate email format
     */
    email(value) {
        if (!value) return false;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value.trim());
    },

    /**
     * Validate 10-digit Indian mobile number
     */
    mobile(value) {
        if (!value) return false;
        const re = /^[6-9]\d{9}$/;
        return re.test(value.trim());
    },

    /**
     * Validate register number (non-empty, alphanumeric)
     */
    registerNumber(value) {
        if (!value) return false;
        return value.trim().length >= 2;
    },

    /**
     * Validate team name
     */
    teamName(value) {
        if (!value) return false;
        const trimmed = value.trim();
        return trimmed.length >= 2 && trimmed.length <= 60;
    },

    /**
     * Show error on a field
     */
    showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.add('error');
        if (error) {
            error.textContent = message;
            error.classList.add('visible');
        }
    },

    /**
     * Clear error on a field
     */
    clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.remove('error');
        if (error) {
            error.textContent = '';
            error.classList.remove('visible');
        }
    },

    /**
     * Clear all errors
     */
    clearAllErrors() {
        document.querySelectorAll('.form-input.error, .form-select.error').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
            el.classList.remove('visible');
        });
    },

    /**
     * Validate Step 0: Team Name
     */
    validateTeamName() {
        const val = document.getElementById('teamName').value;
        if (!this.required(val)) {
            this.showError('teamName', 'teamNameError', 'Team name is required.');
            return false;
        }
        if (!this.teamName(val)) {
            this.showError('teamName', 'teamNameError', 'Team name must be 2–60 characters.');
            return false;
        }
        this.clearError('teamName', 'teamNameError');
        return true;
    },

    /**
     * Validate event selection (tech or non-tech)
     */
    validateEventSelection(type) {
        const containerId = type === 'tech' ? 'techEventSelect' : 'nonTechEventSelect';
        const errorId = type === 'tech' ? 'techEventError' : 'nonTechEventError';
        const selected = document.querySelector(`#${containerId} .event-select-card.selected`);
        const error = document.getElementById(errorId);

        if (!selected) {
            if (error) {
                error.textContent = `Please select a ${type === 'tech' ? 'technical' : 'non-technical'} event.`;
                error.classList.add('visible');
            }
            return false;
        }
        if (error) {
            error.textContent = '';
            error.classList.remove('visible');
        }
        return true;
    },

    /**
     * Validate member details (member 1 or 2)
     * @param {string} prefix - 'm1' or 'm2'
     */
    validateMember(prefix) {
        let valid = true;

        // Name
        const name = document.getElementById(`${prefix}Name`).value;
        if (!this.required(name)) {
            this.showError(`${prefix}Name`, `${prefix}NameError`, 'Name is required.');
            valid = false;
        } else {
            this.clearError(`${prefix}Name`, `${prefix}NameError`);
        }

        // Register Number
        const regNo = document.getElementById(`${prefix}RegNo`).value;
        if (!this.required(regNo)) {
            this.showError(`${prefix}RegNo`, `${prefix}RegNoError`, 'Register number is required.');
            valid = false;
        } else if (!this.registerNumber(regNo)) {
            this.showError(`${prefix}RegNo`, `${prefix}RegNoError`, 'Enter a valid register number.');
            valid = false;
        } else {
            this.clearError(`${prefix}RegNo`, `${prefix}RegNoError`);
        }

        // College
        const college = document.getElementById(`${prefix}College`).value;
        if (!college) {
            this.showError(`${prefix}College`, `${prefix}CollegeError`, 'Please select a college.');
            valid = false;
        } else {
            this.clearError(`${prefix}College`, `${prefix}CollegeError`);

            // If Other, validate college name and code
            if (college === 'Other') {
                const collegeName = document.getElementById(`${prefix}CollegeName`).value;
                const collegeCode = document.getElementById(`${prefix}CollegeCode`).value;

                if (!this.required(collegeName)) {
                    this.showError(`${prefix}CollegeName`, `${prefix}CollegeNameError`, 'College name is required.');
                    valid = false;
                } else {
                    this.clearError(`${prefix}CollegeName`, `${prefix}CollegeNameError`);
                }

                if (!this.required(collegeCode)) {
                    this.showError(`${prefix}CollegeCode`, `${prefix}CollegeCodeError`, 'College code is required.');
                    valid = false;
                } else {
                    this.clearError(`${prefix}CollegeCode`, `${prefix}CollegeCodeError`);
                }
            }
        }

        // Email
        const email = document.getElementById(`${prefix}Email`).value;
        if (!this.required(email)) {
            this.showError(`${prefix}Email`, `${prefix}EmailError`, 'Email is required.');
            valid = false;
        } else if (!this.email(email)) {
            this.showError(`${prefix}Email`, `${prefix}EmailError`, 'Enter a valid email address.');
            valid = false;
        } else {
            this.clearError(`${prefix}Email`, `${prefix}EmailError`);
        }

        // Mobile
        const mobile = document.getElementById(`${prefix}Mobile`).value;
        if (!this.required(mobile)) {
            this.showError(`${prefix}Mobile`, `${prefix}MobileError`, 'Mobile number is required.');
            valid = false;
        } else if (!this.mobile(mobile)) {
            this.showError(`${prefix}Mobile`, `${prefix}MobileError`, 'Enter a valid 10-digit mobile number.');
            valid = false;
        } else {
            this.clearError(`${prefix}Mobile`, `${prefix}MobileError`);
        }

        return valid;
    },

    /**
     * Cross-validate members (duplicate email, register number)
     */
    validateCrossMember() {
        let valid = true;

        const m1RegNo = document.getElementById('m1RegNo').value.trim().toLowerCase();
        const m2RegNo = document.getElementById('m2RegNo').value.trim().toLowerCase();
        const m1Email = document.getElementById('m1Email').value.trim().toLowerCase();
        const m2Email = document.getElementById('m2Email').value.trim().toLowerCase();

        if (m1RegNo && m2RegNo && m1RegNo === m2RegNo) {
            this.showError('m2RegNo', 'm2RegNoError', 'Member 2 cannot have the same register number as Member 1.');
            valid = false;
        }

        if (m1Email && m2Email && m1Email === m2Email) {
            this.showError('m2Email', 'm2EmailError', 'Member 2 cannot have the same email as Member 1.');
            valid = false;
        }

        return valid;
    },

    /**
     * Validate rules acknowledgement
     */
    validateAcknowledgement() {
        const checkbox = document.getElementById('rulesAgree');
        const error = document.getElementById('rulesAgreeError');
        if (!checkbox.checked) {
            if (error) {
                error.textContent = 'You must agree to the rules before submitting.';
                error.classList.add('visible');
            }
            return false;
        }
        if (error) {
            error.textContent = '';
            error.classList.remove('visible');
        }
        return true;
    }
};

window.Validator = Validator;

