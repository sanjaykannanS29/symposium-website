/**
 * DRAKEN'26 — Events Module
 * Renders event cards and handles modal interactions for all 6 events.
 */

const Events = {

    init() {
        this.renderCards();
        this.bindModal();
    },

    renderCards() {
        const techGrid = document.getElementById('technicalEventsGrid');
        const nonTechGrid = document.getElementById('nonTechnicalEventsGrid');
        const config = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);

        if (!config || !config.EVENTS) return;

        if (techGrid && config.EVENTS.technical) {
            techGrid.innerHTML = config.EVENTS.technical
                .map(event => this.createCard(event))
                .join('');
        }

        if (nonTechGrid && config.EVENTS.nonTechnical) {
            nonTechGrid.innerHTML = config.EVENTS.nonTechnical
                .map(event => this.createCard(event))
                .join('');
        }
    },

    createCard(event) {
        const themeBadges = {
            'unveil': '📄 Research & Paper Presentation',
            'fuse': '⚡ Colliding Ideas & Innovation',
            'manifest': '🎛️ Hardware & Project Expo',
            'cinora': '🎬 Short Film & Lens Challenge',
            'gameverse': '🎮 Rapid Mini-Games & Conquest',
            'aamec-got-talent': '🎙️ Entertainment & Stage Spotlight'
        };
        const badgeText = themeBadges[event.id] || '🐉 Dragon ECE Core';

        return `
            <article class="event-card event-theme-${event.id}" data-event-id="${event.id}" data-event-theme="${event.id}" tabindex="0" role="button"
                aria-label="View details for ${event.name}">
                <div class="event-card-header">
                    <span class="event-card-index">${event.index ? event.index + ' //' : ''}</span>
                    <span class="event-card-category">${event.category}</span>
                </div>
                <h3 class="event-card-name">${event.name}</h3>
                <p class="event-card-tagline">${event.tagline}</p>
                <div class="event-theme-badge-wrapper">
                    <span class="event-theme-badge">${badgeText}</span>
                </div>
                <p class="event-card-type">${event.type}</p>
                <span class="event-card-arrow" aria-hidden="true">→</span>
            </article>
        `;
    },

    bindModal() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.event-card');
            if (card) {
                const eventId = card.dataset.eventId;
                this.openModal(eventId);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const card = e.target.closest('.event-card');
                if (card) {
                    const eventId = card.dataset.eventId;
                    this.openModal(eventId);
                }
            }
        });

        const closeBtn = document.getElementById('modalClose');
        const overlay = document.getElementById('eventModal');

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    },

    findEvent(id) {
        const config = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);
        if (!config || !config.EVENTS) return null;
        const all = [...(config.EVENTS.technical || []), ...(config.EVENTS.nonTechnical || [])];
        return all.find(ev => ev.id === id);
    },

    openModal(eventId) {
        const event = this.findEvent(eventId);
        if (!event) return;

        const overlay = document.getElementById('eventModal');
        const categoryEl = document.getElementById('modalCategory');
        const nameEl = document.getElementById('modalName');
        const taglineEl = document.getElementById('modalTagline');
        const bodyEl = document.getElementById('modalBody');

        if (categoryEl) categoryEl.textContent = `${event.index ? event.index + ' // ' : ''}${event.category}`;
        if (nameEl) nameEl.textContent = event.name;
        if (taglineEl) taglineEl.textContent = event.tagline;

        if (bodyEl) {
            bodyEl.innerHTML = this.buildModalBody(event);
        }

        if (overlay) {
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
            const closeBtn = document.getElementById('modalClose');
            if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
        }
    },

    closeModal() {
        const overlay = document.getElementById('eventModal');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    },

    buildModalBody(event) {
        let html = '';

        html += `<div class="modal-type">${event.type}</div>`;
        html += `<p class="modal-description">${event.description}</p>`;

        html += '<div class="modal-meta">';
        html += `
            <div class="modal-meta-item">
                <span class="modal-meta-label">Team Size</span>
                <span class="modal-meta-value">${event.teamSize}</span>
            </div>
        `;

        if (event.duration) {
            html += `
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Duration</span>
                    <span class="modal-meta-value">${event.duration}</span>
                </div>
            `;
        }

        if (event.format) {
            html += `
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Format</span>
                    <span class="modal-meta-value">${event.format}</span>
                </div>
            `;
        }

        if (event.soloActs) {
            html += `
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Solo Acts</span>
                    <span class="modal-meta-value">${event.soloActs}</span>
                </div>
            `;
        }

        html += '</div>';

        if (event.quotes && event.quotes.length > 0) {
            html += '<div class="modal-quotes-box" style="margin: 16px 0; padding: 14px 18px; background: rgba(255, 85, 0, 0.08); border-left: 3px solid var(--orange-bright);">';
            event.quotes.forEach(q => {
                html += `<p style="font-style: italic; font-size: 0.9rem; color: var(--orange-bright); margin-bottom: 4px;">"${q}"</p>`;
            });
            html += '</div>';
        }

        if (event.rounds && event.rounds.length > 0) {
            html += '<div class="modal-section-title">Event Rounds</div>';
            html += '<div class="modal-rounds-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">';
            event.rounds.forEach(r => {
                html += `
                    <div class="modal-round-item" style="padding: 12px 16px; background: var(--bg-tertiary); border: 1px solid var(--border-light);">
                        <h4 style="font-family: var(--font-display); font-size: 0.95rem; color: var(--orange-bright); margin-bottom: 4px;">${r.name}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${r.desc}</p>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (event.extraInfo) {
            html += `<div class="modal-extra-info">${event.extraInfo}</div>`;
        }

        if (event.rules && event.rules.length > 0) {
            html += '<div class="modal-section-title">Rules</div>';
            html += '<ul class="modal-rules-list">';
            event.rules.forEach(rule => {
                const processed = rule.replace(
                    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                    '<a href="mailto:$1" style="color: var(--orange-bright);">$1</a>'
                );
                html += `<li>${processed}</li>`;
            });
            html += '</ul>';
        }

        if (event.judgingCriteria && event.judgingCriteria.length > 0) {
            html += '<div class="modal-section-title">Judging Criteria</div>';
            html += '<ul class="modal-criteria-list">';
            event.judgingCriteria.forEach(criterion => {
                html += `<li>${criterion}</li>`;
            });
            html += '</ul>';
        }

        return html;
    }
};

// Make Events explicitly available globally
window.Events = Events;
