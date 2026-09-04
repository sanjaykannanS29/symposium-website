/**
 * DRAKEN'26 — Master Main Controller & Cinematic Opening Engine
 * Handles the cinematic awakening transition into the website (with ZERO delay),
 * Web Audio API dragon roar sound synthesis, section rendering, and smooth interactions.
 */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════
       CINEMATIC AWAKENING TRANSITION ENGINE
       Minimal, Premium, Smooth Particle & Light Canvas Reveal
       Text Reveal: DRAKEN'26 ONLY (Zero image zoom / Zero extra text)
       ═══════════════════════════════════════════════════ */
    const OpeningEngine = {
        canvas: null,
        ctx: null,
        particles: [],
        smokeClouds: [],
        animFrame: null,
        startTime: null,
        duration: 5200, // 5.2s 4-phase dragon awakening intro
        completed: false,

        init() {
            // Guard: Play intro ONCE on initial site load only
            if (sessionStorage.getItem('draken26_intro_played') === 'true') {
                this.finish(true);
                return;
            }

            this.initCanvas();
            this.startTime = performance.now();
            this.animate(performance.now());
        },

        initCanvas() {
            this.canvas = document.getElementById('heroAwakeningCanvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());

            const w = this.canvas.width;
            const h = this.canvas.height;

            // 1. Drifting Ember Particles
            this.particles = [];
            const emberCount = window.innerWidth < 768 ? 40 : 85;
            for (let i = 0; i < emberCount; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * 2.2 + 0.8,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: -Math.random() * 0.7 - 0.3,
                    alpha: Math.random() * 0.5 + 0.1,
                    pulse: Math.random() * Math.PI * 2
                });
            }

            // 2. Volumetric Smoke & Light Mist Clouds
            this.smokeClouds = [];
            const cloudCount = window.innerWidth < 768 ? 16 : 30;
            for (let i = 0; i < cloudCount; i++) {
                this.smokeClouds.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * 220 + 110,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.12,
                    alpha: Math.random() * 0.12 + 0.04
                });
            }
        },

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        animate(now) {
            if (!this.ctx || !this.canvas) return;

            const elapsed = now - this.startTime;
            const w = this.canvas.width;
            const h = this.canvas.height;

            this.ctx.clearRect(0, 0, w, h);

            /* ── CLEAN ELEGANT CINEMATIC INTRO TRANSITION ─────────────────────
               0.0s – 1.0s : Darkness & subtle drifting mist
               1.0s – 2.6s : Ambient firelight swell & ember particle drift
               2.6s – 3.6s : DRAKEN'26 revealed with glowing depth
               3.6s – 4.5s : Smooth continuous dissolve into homepage hero
               ────────────────────────────────────────────────────────── */

            let bgAlpha = 1;
            let glowIntensity = 0;
            let titleOpacity = 0;

            if (elapsed < 1000) {
                bgAlpha = 0.98;
                glowIntensity = 0.1;
                titleOpacity = 0;
            } else if (elapsed < 2600) {
                const p = (elapsed - 1000) / 1600;
                bgAlpha = 0.95;
                glowIntensity = p * 0.7;
                titleOpacity = p * 0.5;
            } else if (elapsed < 3600) {
                const p = (elapsed - 2600) / 1000;
                bgAlpha = 0.92;
                glowIntensity = 0.7 + Math.sin(p * Math.PI) * 0.3;
                titleOpacity = 1.0;
            } else if (elapsed < 4500) {
                const p = (elapsed - 3600) / 900;
                bgAlpha = 1.0 - p;
                glowIntensity = 1.0 * (1.0 - p);
                titleOpacity = 1.0 - p;

                const heroContent = document.getElementById('heroContent');
                if (heroContent && !heroContent.classList.contains('awakened')) {
                    heroContent.classList.add('awakened');
                }
            } else {
                bgAlpha = 0;
                titleOpacity = 0;
            }

            // 1. Draw Darkness Base
            this.ctx.fillStyle = `rgba(5, 5, 7, ${bgAlpha})`;
            this.ctx.fillRect(0, 0, w, h);

            // 2. Render Volumetric Background Smoke Clouds
            this.smokeClouds.forEach(cloud => {
                cloud.x += cloud.vx;
                cloud.y += cloud.vy;
                if (cloud.x < -cloud.radius) cloud.x = w + cloud.radius;
                if (cloud.x > w + cloud.radius) cloud.x = -cloud.radius;

                const cloudGrad = this.ctx.createRadialGradient(
                    cloud.x, cloud.y, 10,
                    cloud.x, cloud.y, cloud.radius
                );
                cloudGrad.addColorStop(0, `rgba(35, 25, 30, ${cloud.alpha * bgAlpha})`);
                cloudGrad.addColorStop(0.6, `rgba(15, 12, 18, ${cloud.alpha * 0.4 * bgAlpha})`);
                cloudGrad.addColorStop(1, `rgba(5, 5, 7, 0)`);

                this.ctx.fillStyle = cloudGrad;
                this.ctx.beginPath();
                this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // 3. Render Center Volumetric Fire & Energy Light Glow
            if (glowIntensity > 0) {
                const glowGrad = this.ctx.createRadialGradient(
                    w / 2, h / 2, 20,
                    w / 2, h / 2, Math.max(w, h) * 0.65
                );
                glowGrad.addColorStop(0, `rgba(255, 95, 0, ${0.45 * glowIntensity * bgAlpha})`);
                glowGrad.addColorStop(0.45, `rgba(180, 50, 0, ${0.2 * glowIntensity * bgAlpha})`);
                glowGrad.addColorStop(1, `rgba(5, 5, 7, 0)`);

                this.ctx.fillStyle = glowGrad;
                this.ctx.fillRect(0, 0, w, h);
            }

            // 4. Render Floating Drifting Embers
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.04;
                if (p.y < 0) {
                    p.y = h + 10;
                    p.x = Math.random() * w;
                }
                const currentAlpha = p.alpha * (0.7 + Math.sin(p.pulse) * 0.3) * bgAlpha;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 110, 0, ${currentAlpha})`;
                this.ctx.fill();
            });

            // 5. Official Reference Poster Typography Title Reveal: DRAKEN'26 ONLY
            if (titleOpacity > 0 && bgAlpha > 0.02) {
                this.ctx.save();
                this.ctx.translate(w / 2, h / 2);

                const fontSize = Math.min(w * 0.115, 96);
                this.ctx.font = `900 ${fontSize}px "Cinzel Decorative", "Space Grotesk", serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                // Metallic Gold Gradient Fill
                const goldGrad = this.ctx.createLinearGradient(0, -fontSize * 0.5, 0, fontSize * 0.5);
                goldGrad.addColorStop(0, `rgba(255, 248, 214, ${titleOpacity * bgAlpha})`);
                goldGrad.addColorStop(0.3, `rgba(255, 215, 0, ${titleOpacity * bgAlpha})`);
                goldGrad.addColorStop(0.65, `rgba(255, 136, 0, ${titleOpacity * bgAlpha})`);
                goldGrad.addColorStop(0.9, `rgba(153, 51, 0, ${titleOpacity * bgAlpha})`);
                goldGrad.addColorStop(1, `rgba(255, 224, 102, ${titleOpacity * bgAlpha})`);

                // 3D Dark Extrusion Depth Shadows
                this.ctx.shadowColor = `rgba(0, 0, 0, ${0.9 * titleOpacity * bgAlpha})`;
                this.ctx.shadowBlur = 12;
                this.ctx.fillStyle = `rgba(20, 10, 5, ${titleOpacity * bgAlpha})`;
                for (let s = 6; s > 0; s--) {
                    this.ctx.fillText("DRAKEN'26", s, s);
                }

                // Outer Fire & Gold Illumination Glow
                this.ctx.shadowColor = `rgba(255, 136, 0, ${0.85 * titleOpacity * bgAlpha})`;
                this.ctx.shadowBlur = 36;
                this.ctx.fillStyle = goldGrad;
                this.ctx.fillText("DRAKEN'26", 0, 0);

                this.ctx.restore();
            }

            // Finish transition at 4.5s
            if (elapsed >= 4500 && !this.completed) {
                this.completed = true;
                this.finish(false);
                return;
            }

            if (elapsed < 4500) {
                this.animFrame = requestAnimationFrame((n) => this.animate(n));
            }
        },

        finish(instant = false) {
            sessionStorage.setItem('draken26_intro_played', 'true');

            if (this.canvas) {
                this.canvas.classList.add('faded');
                this.canvas.style.display = 'none';
            }

            document.body.classList.remove('opening-active');

            const heroContent = document.getElementById('heroContent');
            if (heroContent) heroContent.classList.add('awakened');

            if (this.animFrame) {
                cancelAnimationFrame(this.animFrame);
            }
        },

        /**
         * Visual effect on registration complete
         */
        playRegistrationSuccessCinematic() {
            const fireEffect = document.getElementById('regSuccessFireEffect');
            if (fireEffect) {
                fireEffect.classList.remove('active');
                void fireEffect.offsetWidth;
                fireEffect.classList.add('active');
            }
        }
    };

    window.OpeningEngine = OpeningEngine;


    /* ═══════════════════════════════════════════════════
       NAVIGATION & FAQ & RENDER HELPERS
       ═══════════════════════════════════════════════════ */
    const Nav = {
        init() {
            this.bindScroll();
            this.bindHamburger();
            this.bindSmoothScroll();
            this.bindActiveSection();
        },

        bindScroll() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 60) {
                    navbar.classList.add('compact');
                } else {
                    navbar.classList.remove('compact');
                }
            }, { passive: true });
        },

        bindHamburger() {
            const hamburger = document.getElementById('navHamburger');
            const overlay = document.getElementById('navMobileOverlay');
            const menu = document.getElementById('navMobileMenu');

            if (!hamburger || !menu) return;

            const toggle = () => {
                const isActive = hamburger.classList.contains('active');
                hamburger.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', !isActive);
                if (menu) menu.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            };

            hamburger.addEventListener('click', toggle);
            if (overlay) overlay.addEventListener('click', toggle);

            document.querySelectorAll('.nav-mobile-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (hamburger.classList.contains('active')) toggle();
                });
            });
        },

        bindSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const navHeight = document.getElementById('navbar')?.offsetHeight || 60;
                        const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                });
            });
        },

        bindActiveSection() {
            const sections = document.getElementById('mainSite')?.querySelectorAll('section[id]') || [];
            const navLinks = document.querySelectorAll('.nav-link[data-section]');
            const mobileLinks = document.querySelectorAll('.nav-mobile-link[data-section]');

            if (!sections.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.dataset.section === id);
                        });
                        mobileLinks.forEach(link => {
                            link.classList.toggle('active', link.dataset.section === id);
                        });
                    }
                });
            }, {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            });

            sections.forEach(section => observer.observe(section));
        }
    };

    function renderRules() {
        const container = document.getElementById('rulesList');
        const config = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);
        if (!container || !config) return;

        const categories = config.RULE_CATEGORIES || [
            {
                category: 'General Rules',
                icon: '📜',
                items: [
                    'Registration is mandatory for all participants.',
                    'Participants must maintain discipline and decorum throughout the event.'
                ]
            },
            {
                category: 'Event Rules',
                icon: '⚡',
                items: [
                    'Each team can participate according to event-specific team size and event rules.',
                    'Team size and event-specific rules must be strictly followed.'
                ]
            },
            {
                category: 'Registration Guidelines',
                icon: '📝',
                items: [
                    'Certificates will be provided only to registered participants.'
                ]
            },
            {
                category: 'Participation Guidelines',
                icon: '⏰',
                items: [
                    'Participants should report 15–30 minutes before their scheduled event.',
                    'Latecomers may not be permitted.'
                ]
            },
            {
                category: 'Judging / Decision',
                icon: '⚖️',
                items: [
                    'Judges\' and event coordinators\' decisions are final and binding.'
                ]
            },
            {
                category: 'Important Restrictions',
                icon: '🚫',
                items: [
                    'Malpractice, plagiarism, or misconduct may result in immediate disqualification.',
                    'The organizing committee may change the schedule, rules, or venue if necessary.'
                ]
            }
        ];

        container.innerHTML = categories.map((cat, i) => `
            <div class="rules-category-card" id="rule-cat-${i}">
                <button class="rules-category-header" type="button" aria-expanded="false" aria-controls="rule-cat-body-${i}" id="rule-cat-btn-${i}">
                    <div class="rules-category-title">
                        <span class="rules-category-icon">${cat.icon}</span>
                        <span>${cat.category}</span>
                    </div>
                    <span class="rules-category-arrow" aria-hidden="true">+</span>
                </button>
                <div class="rules-category-body" id="rule-cat-body-${i}" role="region" aria-labelledby="rule-cat-btn-${i}">
                    <ul class="rules-category-list">
                        ${cat.items.map(item => `<li><span class="rule-bullet">✦</span> ${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.rules-category-header');
            if (!btn) return;

            const card = btn.closest('.rules-category-card');
            if (!card) return;

            const isActive = card.classList.contains('active');
            container.querySelectorAll('.rules-category-card.active').forEach(active => {
                active.classList.remove('active');
                active.querySelector('.rules-category-header')?.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                card.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    function renderFAQ() {
        const container = document.getElementById('faqList');
        const config = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);
        if (!container || !config || !config.FAQ) return;

        container.innerHTML = config.FAQ.map((item, i) => `
            <div class="faq-item" id="faq-item-${i}">
                <button class="faq-question" type="button" aria-expanded="false"
                    aria-controls="faq-answer-${i}" id="faq-btn-${i}">
                    <span>${item.question}</span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                </button>
                <div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-btn-${i}">
                    <p class="faq-answer-text">${item.answer}</p>
                </div>
            </div>
        `).join('');

        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-question');
            if (!btn) return;

            const item = btn.closest('.faq-item');
            if (!item) return;

            const isActive = item.classList.contains('active');

            container.querySelectorAll('.faq-item.active').forEach(active => {
                active.classList.remove('active');
                active.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    function renderContacts() {
        const container = document.getElementById('contactGrid');
        const config = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);
        if (!container || !config || !config.CONTACTS) return;

        const c = config.CONTACTS;
        let html = '';

        html += buildContactGroup('Principal', [c.principal]);
        html += buildContactGroup(c.hod.title, [c.hod]);
        html += buildContactGroup('Faculty Coordinators', c.facultyCoordinators);
        html += buildContactGroup('Student Coordinators', c.studentCoordinators);

        container.innerHTML = html;
    }

    function buildContactGroup(title, people) {
        let html = `<div class="contact-group">
            <div class="contact-role">${title}</div>`;

        people.forEach(person => {
            html += `<div class="contact-person">
                <div class="contact-name">${person.name}</div>`;
            if (person.phone) {
                html += `<div class="contact-phone"><a href="tel:${person.phone}">${person.phone}</a></div>`;
            }
            html += `</div>`;
        });

        html += `</div>`;
        return html;
    }

    function initLocation() {
        const mapIframe = document.getElementById('locationMap');
        const directionsLink = document.getElementById('locationDirections');
        const config = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);

        if (!config) return;

        if (mapIframe && config.MAP_EMBED_URL) {
            mapIframe.src = config.MAP_EMBED_URL;
        }
        if (directionsLink && config.MAP_DIRECTIONS_URL) {
            directionsLink.href = config.MAP_DIRECTIONS_URL;
        }
    }

    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.05
        });

        reveals.forEach(el => observer.observe(el));
    }

    /* ═══════════════════════════════════════════════════
       DRAKEN'26 — CINEMATIC DRAGON × ECE 3D ENVIRONMENT ENGINE
       Full-Page Continuous 3D Environment:
       Rising 3D volcanic flames surging from bottom to top,
       dragon head & scale contours, pulsing dragon eyes,
       volumetric smoke, sparks & drifting embers,
       glowing 3D PCB circuit traces with traveling signal pulses,
       floating 3D microchips & ECE components, 3D card tilt
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       DRAKEN'26 — CINEMATIC DRAGON × ECE 3D ENVIRONMENT ENGINE
       Visual Balance:
       1. DRAGON = Main Background Visual (60% prominence & lighting)
       2. ECE 3D ELEMENTS = Secondary (Circuit Traces, Pulses, Microchips)
       3. FIRE / FLAMES = Controlled Atmospheric Lighting (Reduced 65%)
       4. SMOKE & EMBERS = Depth Atmosphere (25%)
       ═══════════════════════════════════════════════════ */
    const DragonECE3DEngine = {
        canvas: null,
        ctx: null,
        particles: [],
        smokeClouds: [],
        risingFlames: [],
        pcbTraces: [],
        electricalPulses: [],
        floatingChips: [],
        animFrame: null,
        mouseX: 0,
        mouseY: 0,
        targetMouseX: 0,
        targetMouseY: 0,
        isMobile: false,

        init() {
            this.canvas = document.getElementById('cinematicDragonCanvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.isMobile = window.innerWidth < 768;

            this.resize();
            window.addEventListener('resize', () => {
                this.isMobile = window.innerWidth < 768;
                this.resize();
                this.initEnvironment();
            });

            if (!this.isMobile) {
                window.addEventListener('mousemove', (e) => {
                    this.targetMouseX = e.clientX;
                    this.targetMouseY = e.clientY;
                });
                this.initCard3DTilt();
            }

            this.initEnvironment();
            this.animate(performance.now());
        },

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        initEnvironment() {
            const w = this.canvas.width;
            const h = this.canvas.height;

            // 1. Moderate Embers & Spark Particles (5% Composition)
            this.particles = [];
            const emberCount = this.isMobile ? 20 : 48;
            for (let i = 0; i < emberCount; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * 2.2 + 0.6,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: -Math.random() * 0.9 - 0.3,
                    alpha: Math.random() * 0.55 + 0.15,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.04 + 0.02,
                    isSpark: Math.random() < 0.25
                });
            }

            // 2. Volumetric Smoke Clouds (20% Composition)
            this.smokeClouds = [];
            const cloudCount = this.isMobile ? 10 : 18;
            for (let i = 0; i < cloudCount; i++) {
                this.smokeClouds.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * (this.isMobile ? 160 : 300) + 120,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.08,
                    alpha: Math.random() * 0.08 + 0.02,
                    isFlame: Math.random() < 0.25
                });
            }

            // 3. Controlled Atmospheric Flame Plumes (Reduced by 65% for 15% Fire Lighting)
            this.risingFlames = [];
            const flameCount = this.isMobile ? 10 : 24;
            for (let i = 0; i < flameCount; i++) {
                this.risingFlames.push({
                    x: Math.random() * w,
                    y: h + Math.random() * 60,
                    radius: Math.random() * 24 + 10,
                    vy: -Math.random() * 2.2 - 0.8,
                    vx: (Math.random() - 0.5) * 0.6,
                    alpha: Math.random() * 0.28 + 0.12,
                    life: 1.0,
                    decay: Math.random() * 0.01 + 0.004,
                    waveOffset: Math.random() * Math.PI * 2
                });
            }

            // 4. ECE Printed Circuit Board (PCB) Traces & Nodes
            this.pcbTraces = [];
            const gridCols = this.isMobile ? 6 : 12;
            const colWidth = w / gridCols;
            for (let c = 0; c <= gridCols; c++) {
                const x = c * colWidth;
                const tracePoints = [];
                let currentY = 0;

                while (currentY < h) {
                    const stepY = Math.random() * 160 + 90;
                    currentY += stepY;
                    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 35 + 15);
                    tracePoints.push({ x: x + offset, y: currentY });
                }

                this.pcbTraces.push({ startX: x, points: tracePoints });
            }

            // 5. Traveling Circuit Signal Energy Pulses
            this.electricalPulses = [];
            const pulseCount = this.isMobile ? 10 : 24;
            for (let i = 0; i < pulseCount; i++) {
                this.electricalPulses.push({
                    traceIndex: Math.floor(Math.random() * this.pcbTraces.length),
                    progress: Math.random(),
                    speed: Math.random() * 0.0025 + 0.0012,
                    color: Math.random() < 0.7 ? '#ff6600' : '#ffaa00',
                    size: Math.random() * 2.5 + 1.8
                });
            }

            // 6. Floating 3D Microchips & IC Components (Desktop)
            this.floatingChips = [];
            if (!this.isMobile) {
                const chipCount = 6;
                for (let i = 0; i < chipCount; i++) {
                    this.floatingChips.push({
                        x: Math.random() * (w - 200) + 100,
                        y: Math.random() * (h - 200) + 100,
                        size: Math.random() * 40 + 25,
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 0.003,
                        vy: (Math.random() - 0.5) * 0.15,
                        pins: Math.floor(Math.random() * 4 + 4) * 2
                    });
                }
            }
        },

        initCard3DTilt() {
            const cards = document.querySelectorAll('.event-card, .organizer-card, .rules-item, .faq-item, .registration-wrapper, .location-wrapper, .reg-complete-token-card');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const tiltX = ((y - centerY) / centerY) * -4.5;
                    const tiltY = ((x - centerX) / centerX) * 4.5;

                    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                });
            });
        },

        animate(now) {
            if (!this.ctx || !this.canvas) return;

            const w = this.canvas.width;
            const h = this.canvas.height;
            const timeSec = now * 0.001;

            // Smooth mouse interpolation
            this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
            this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

            this.ctx.clearRect(0, 0, w, h);

            // ── LAYER 1: Volumetric Dragon Lair Smoke Mist ──────────────────────
            this.smokeClouds.forEach(cloud => {
                cloud.x += cloud.vx;
                cloud.y += cloud.vy;

                if (cloud.x < -cloud.radius) cloud.x = w + cloud.radius;
                if (cloud.x > w + cloud.radius) cloud.x = -cloud.radius;
                if (cloud.y < -cloud.radius) cloud.y = h + cloud.radius;
                if (cloud.y > h + cloud.radius) cloud.y = -cloud.radius;

                const parallaxX = (this.mouseX - w / 2) * 0.015;
                const parallaxY = (this.mouseY - h / 2) * 0.015;

                const cloudGrad = this.ctx.createRadialGradient(
                    cloud.x + parallaxX, cloud.y + parallaxY, 10,
                    cloud.x + parallaxX, cloud.y + parallaxY, cloud.radius
                );

                if (cloud.isFlame) {
                    cloudGrad.addColorStop(0, `rgba(50, 18, 8, ${cloud.alpha * 1.2})`);
                    cloudGrad.addColorStop(0.5, `rgba(28, 10, 6, ${cloud.alpha * 0.5})`);
                } else {
                    cloudGrad.addColorStop(0, `rgba(30, 18, 24, ${cloud.alpha})`);
                    cloudGrad.addColorStop(0.5, `rgba(14, 10, 14, ${cloud.alpha * 0.4})`);
                }
                cloudGrad.addColorStop(1, 'rgba(5, 5, 7, 0)');

                this.ctx.fillStyle = cloudGrad;
                this.ctx.beginPath();
                this.ctx.arc(cloud.x + parallaxX, cloud.y + parallaxY, cloud.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // ── LAYER 2: PRIMARY VISUAL SUBJECT — FIERY ORANGE & AMBER 3D DRAGON ───────────
            if (!this.isMobile) {
                const dragonX = w * 0.78;
                const dragonY = h * 0.32;
                const eyePulse = (Math.sin(timeSec * 0.8) * 0.5 + 0.5);

                this.ctx.save();

                // 2A. Dragon Silhouette Fill & Fiery Orange Rim Highlights
                this.ctx.fillStyle = 'rgba(20, 10, 6, 0.92)';
                this.ctx.strokeStyle = 'rgba(255, 102, 0, 0.75)';
                this.ctx.lineWidth = 2;

                // Head & Snout Silhouette Path
                this.ctx.beginPath();
                this.ctx.moveTo(dragonX - 160, dragonY + 20); // Jaw
                this.ctx.lineTo(dragonX - 220, dragonY - 30); // Snout tip
                this.ctx.lineTo(dragonX - 170, dragonY - 80); // Crest / Forehead
                this.ctx.lineTo(dragonX - 120, dragonY - 140); // Main Horn Top
                this.ctx.lineTo(dragonX - 90, dragonY - 90);  // Horn Base
                this.ctx.lineTo(dragonX - 50, dragonY - 130); // Secondary Horn
                this.ctx.lineTo(dragonX - 30, dragonY - 70);  // Neck Back
                this.ctx.lineTo(dragonX + 120, dragonY - 120); // Wing Ridge Top
                this.ctx.lineTo(dragonX + 220, dragonY + 40);  // Wing Edge Outer
                this.ctx.lineTo(dragonX + 60, dragonY + 180);  // Body Shoulder
                this.ctx.lineTo(dragonX - 90, dragonY + 120);  // Neck Throat
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();

                // 2B. Dragon Scale Plates & Amber Gold Rim Lighting
                this.ctx.strokeStyle = 'rgba(255, 170, 0, 0.85)';
                this.ctx.lineWidth = 1.6;
                this.ctx.beginPath();
                // Scale contour arcs along throat & neck
                this.ctx.arc(dragonX - 120, dragonY + 20, 45, Math.PI * 0.7, Math.PI * 1.5);
                this.ctx.arc(dragonX - 70, dragonY + 60, 60, Math.PI * 0.8, Math.PI * 1.6);
                this.ctx.arc(dragonX - 20, dragonY + 100, 75, Math.PI * 0.85, Math.PI * 1.65);
                // Snout & Brow ridge highlight
                this.ctx.moveTo(dragonX - 210, dragonY - 35);
                this.ctx.lineTo(dragonX - 165, dragonY - 75);
                this.ctx.lineTo(dragonX - 118, dragonY - 130);
                this.ctx.stroke();

                // Occasional High-Voltage Orange/Gold Lightning Arc across Wing Ridge
                if (Math.random() < 0.08) {
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.shadowColor = '#ffaa00';
                    this.ctx.shadowBlur = 20;
                    this.ctx.beginPath();
                    this.ctx.moveTo(dragonX - 120, dragonY - 140);
                    this.ctx.lineTo(dragonX - 30, dragonY - 70);
                    this.ctx.lineTo(dragonX + 120, dragonY - 120);
                    this.ctx.lineTo(dragonX + 220, dragonY + 40);
                    this.ctx.stroke();
                }

                // 2C. GLOWING AMBER GOLD DRAGON EYE
                const eyeX = dragonX - 150;
                const eyeY = dragonY - 45;

                // Eye Fiery Amber Radial Energy Glow
                const eyeGlowGrad = this.ctx.createRadialGradient(eyeX, eyeY, 2, eyeX, eyeY, 80);
                eyeGlowGrad.addColorStop(0, `rgba(255, 170, 0, ${0.6 + eyePulse * 0.4})`);
                eyeGlowGrad.addColorStop(0.4, `rgba(255, 85, 0, ${0.3 + eyePulse * 0.2})`);
                eyeGlowGrad.addColorStop(1, 'rgba(6, 8, 12, 0)');
                this.ctx.fillStyle = eyeGlowGrad;
                this.ctx.beginPath();
                this.ctx.arc(eyeX, eyeY, 80, 0, Math.PI * 2);
                this.ctx.fill();

                // Eye Socket Slit & Iris
                this.ctx.fillStyle = '#ffd700';
                this.ctx.shadowColor = '#ffaa00';
                this.ctx.shadowBlur = 20;
                this.ctx.beginPath();
                this.ctx.ellipse(eyeX, eyeY, 14, 8, -Math.PI / 6, 0, Math.PI * 2);
                this.ctx.fill();

                // Vertical Slit Pupil
                this.ctx.fillStyle = '#06080c';
                this.ctx.shadowBlur = 0;
                this.ctx.beginPath();
                this.ctx.ellipse(eyeX, eyeY, 3, 9, -Math.PI / 6, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.restore();
            }

            // ── LAYER 3: ECE 3D Printed Circuit Board (PCB) Traces & Nodes ──────
            this.ctx.save();
            this.ctx.lineWidth = 1;
            this.pcbTraces.forEach(trace => {
                this.ctx.strokeStyle = 'rgba(255, 102, 0, 0.12)';
                this.ctx.beginPath();
                this.ctx.moveTo(trace.startX, 0);

                let lastX = trace.startX;
                trace.points.forEach(pt => {
                    this.ctx.lineTo(lastX, pt.y - 20);
                    this.ctx.lineTo(pt.x, pt.y);
                    lastX = pt.x;

                    // PCB Node Pad
                    this.ctx.fillStyle = 'rgba(255, 170, 0, 0.25)';
                    this.ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
                });
                this.ctx.lineTo(lastX, h);
                this.ctx.stroke();
            });
            this.ctx.restore();

            // ── LAYER 4: Traveling Circuit Signal Energy Pulses ──────────────────
            this.electricalPulses.forEach(pulse => {
                pulse.progress += pulse.speed;
                if (pulse.progress > 1) {
                    pulse.progress = 0;
                    pulse.traceIndex = Math.floor(Math.random() * this.pcbTraces.length);
                }

                const trace = this.pcbTraces[pulse.traceIndex];
                if (trace && trace.points.length > 0) {
                    const totalPts = trace.points.length;
                    const idx = Math.floor(pulse.progress * totalPts);
                    const pt = trace.points[idx] || trace.points[0];

                    this.ctx.save();
                    this.ctx.fillStyle = pulse.color;
                    this.ctx.shadowColor = pulse.color;
                    this.ctx.shadowBlur = 10;
                    this.ctx.beginPath();
                    this.ctx.arc(pt.x, pt.y, pulse.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            });

            // ── LAYER 5: Floating 3D Microchips (IC Components) ─────────────────
            if (!this.isMobile) {
                this.floatingChips.forEach(chip => {
                    chip.rotation += chip.rotSpeed;
                    chip.y += chip.vy;
                    if (chip.y < -100) chip.y = h + 100;
                    if (chip.y > h + 100) chip.y = -100;

                    this.ctx.save();
                    this.ctx.translate(chip.x, chip.y);
                    this.ctx.rotate(chip.rotation);

                    // Microchip Body
                    this.ctx.fillStyle = 'rgba(20, 14, 8, 0.5)';
                    this.ctx.strokeStyle = 'rgba(255, 102, 0, 0.35)';
                    this.ctx.lineWidth = 1.2;
                    this.ctx.fillRect(-chip.size / 2, -chip.size / 2, chip.size, chip.size);
                    this.ctx.strokeRect(-chip.size / 2, -chip.size / 2, chip.size, chip.size);

                    // Microchip Pin Arrays
                    this.ctx.fillStyle = 'rgba(255, 170, 0, 0.5)';
                    const pinCountPerSide = Math.floor(chip.pins / 4);
                    const pinSpacing = chip.size / (pinCountPerSide + 1);

                    for (let p = 1; p <= pinCountPerSide; p++) {
                        const offset = -chip.size / 2 + p * pinSpacing;
                        // Top & Bottom pins
                        this.ctx.fillRect(offset - 1, -chip.size / 2 - 4, 2, 4);
                        this.ctx.fillRect(offset - 1, chip.size / 2, 2, 4);
                        // Left & Right pins
                        this.ctx.fillRect(-chip.size / 2 - 4, offset - 1, 4, 2);
                        this.ctx.fillRect(chip.size / 2, offset - 1, 4, 2);
                    }

                    this.ctx.restore();
                });
            }

            // ── LAYER 6: Electric Spark & Fiery Energy Particles ────────────────
            this.particles.forEach(p => {
                p.x += p.vx + Math.sin(timeSec + p.pulse) * 0.2;
                p.y += p.vy;
                p.pulse += p.pulseSpeed;

                if (p.y < -10) {
                    p.y = h + 10;
                    p.x = Math.random() * w;
                }

                const currentAlpha = p.alpha * (0.65 + Math.sin(p.pulse) * 0.35);
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                if (p.isSpark) {
                    this.ctx.fillStyle = `rgba(255, 215, 0, ${currentAlpha})`;
                    this.ctx.shadowColor = 'rgba(255, 170, 0, 0.9)';
                    this.ctx.shadowBlur = 8;
                } else {
                    this.ctx.fillStyle = `rgba(255, 102, 0, ${currentAlpha})`;
                    this.ctx.shadowBlur = 0;
                }
                this.ctx.fill();
            });

            this.animFrame = requestAnimationFrame((n) => this.animate(n));
        }
    };

    /* ═══════════════════════════════════════════════════
       INTERACTIVE OSCILLOSCOPE WAVEFORM ENGINE
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       THE DRAGON CORE — ADVANCED ECE POWER SYSTEM ENGINE
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       FULL-PAGE ATMOSPHERIC FIRE, SMOKE & LIGHTNING ENGINE
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       FULL-PAGE ATMOSPHERIC FIRE, SMOKE & LIGHTNING ENGINE
       ═══════════════════════════════════════════════════ */
    const FullPageAtmosphereEngine = {
        canvas: null,
        ctx: null,
        particles: [],
        smokeClouds: [],
        lightningFlash: 0,
        animFrame: null,
        isMobile: false,

        init() {
            this.canvas = document.getElementById('fullPageAtmosphereCanvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.isMobile = window.innerWidth < 768;

            this.resize();
            window.addEventListener('resize', () => {
                this.isMobile = window.innerWidth < 768;
                this.resize();
                this.initElements();
            });

            this.initElements();
            this.animate();
        },

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        initElements() {
            const w = this.canvas.width;
            const h = this.canvas.height;

            // Ambient Embers & Glowing Ash Particles Across Full Page
            this.particles = [];
            const count = this.isMobile ? 30 : 65;
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * 2.5 + 0.7,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: -Math.random() * 0.9 - 0.35,
                    alpha: Math.random() * 0.6 + 0.15,
                    isSpark: Math.random() < 0.3
                });
            }

            // Atmospheric Smoke & Fire Glow Clouds
            this.smokeClouds = [];
            const cloudCount = this.isMobile ? 10 : 20;
            for (let i = 0; i < cloudCount; i++) {
                this.smokeClouds.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * 200 + 120,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.09,
                    alpha: Math.random() * 0.07 + 0.02,
                    isFlame: Math.random() < 0.3
                });
            }
        },

        triggerLightning() {
            this.lightningFlash = 1.0;
        },

        animate() {
            if (!this.ctx || !this.canvas) return;
            const w = this.canvas.width;
            const h = this.canvas.height;

            this.ctx.clearRect(0, 0, w, h);

            // 1. Intermittent Fiery Lightning Flash (Orange-Gold White Light)
            if (this.lightningFlash > 0.01) {
                this.ctx.fillStyle = `rgba(255, 220, 160, ${this.lightningFlash * 0.32})`;
                this.ctx.fillRect(0, 0, w, h);
                this.lightningFlash *= 0.88;
            }

            // 2. Random Intermittent Thunder Lightning
            if (Math.random() < 0.0018) {
                this.triggerLightning();
            }

            // 3. Volumetric Atmospheric Smoke & Low Flame Glow
            this.smokeClouds.forEach(cloud => {
                cloud.x += cloud.vx;
                cloud.y += cloud.vy;

                if (cloud.x < -cloud.radius) cloud.x = w + cloud.radius;
                if (cloud.x > w + cloud.radius) cloud.x = -cloud.radius;
                if (cloud.y < -cloud.radius) cloud.y = h + cloud.radius;
                if (cloud.y > h + cloud.radius) cloud.y = -cloud.radius;

                const grad = this.ctx.createRadialGradient(cloud.x, cloud.y, 10, cloud.x, cloud.y, cloud.radius);
                if (cloud.isFlame) {
                    grad.addColorStop(0, `rgba(60, 22, 10, ${cloud.alpha * 1.3})`);
                    grad.addColorStop(0.5, `rgba(30, 12, 6, ${cloud.alpha * 0.5})`);
                } else {
                    grad.addColorStop(0, `rgba(28, 14, 10, ${cloud.alpha})`);
                    grad.addColorStop(0.5, `rgba(14, 8, 6, ${cloud.alpha * 0.4})`);
                }
                grad.addColorStop(1, 'rgba(4, 4, 4, 0)');

                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // 4. Floating Embers, Sparks & Ash
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.y < 0) {
                    p.y = h + 10;
                    p.x = Math.random() * w;
                }

                this.ctx.globalAlpha = p.alpha;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                if (p.isSpark) {
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.shadowColor = '#ffaa00';
                    this.ctx.shadowBlur = 8;
                } else {
                    this.ctx.fillStyle = '#ff6600';
                    this.ctx.shadowBlur = 0;
                }
                this.ctx.fill();
            });
            this.ctx.globalAlpha = 1.0;

            requestAnimationFrame(() => this.animate());
        }
    };

    /* ═══════════════════════════════════════════════════
       DRAKEN'26 CINEMATIC PROCEDURAL AUDIO ENGINE
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       DRAKEN'26 CINEMATIC PROCEDURAL AUDIO ENGINE
       (Silent Browsing — Sound Triggers ONLY on Interaction)
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       DRAKEN'26 CINEMATIC PROCEDURAL AUDIO ENGINE
       (Minimal, Silent Browsing — Capacitor Sweep + Deep "DURRR" Release + Dragon Roar ONLY)
       ═══════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════
       DRAKEN'26 CINEMATIC PROCEDURAL AUDIO ENGINE
       Exact 1-to-1 Sound Mapping per Final Locked Spec:
       1. DC POWER      -> Short realistic electrical power activation
       2. KNIFE SWITCH  -> Short realistic mechanical knife switch latch
       3. RESISTOR      -> Subtle realistic current flow sound
       4. CAPACITOR     -> ONE continuous evolving charging sweep
       5. FINALE RELEASE-> ONE deep cinematic "DURRRRRR" electrical impact
       6. DRAGON ROAR   -> 4-second organic chest-resonant dragon roar
       ═══════════════════════════════════════════════════ */
    const DrakenCinematicAudioEngine = {
        ctx: null,
        initialized: false,

        init() {
            // Spec Section 12: Browsing remains SILENT.
            // Create AudioContext only on direct user interaction.
            const initAudioOnUserGesture = () => {
                if (this.initialized) return;
                this.ensureContext();
                if (this.ctx && this.ctx.state === 'running') {
                    this.initialized = true;
                    window.removeEventListener('pointerdown', initAudioOnUserGesture);
                    window.removeEventListener('click', initAudioOnUserGesture);
                    window.removeEventListener('touchstart', initAudioOnUserGesture);
                }
            };

            window.addEventListener('pointerdown', initAudioOnUserGesture, { passive: true });
            window.addEventListener('click', initAudioOnUserGesture, { passive: true });
            window.addEventListener('touchstart', initAudioOnUserGesture, { passive: true });
        },

        ensureContext() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => { });
            }
        },

        // 1. DC POWER — Short realistic electrical power activation click + low hum
        playTask1PowerOn() {
            this.ensureContext();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                // Power relay click
                const clickOsc = this.ctx.createOscillator();
                const clickGain = this.ctx.createGain();
                clickOsc.type = 'sawtooth';
                clickOsc.frequency.setValueAtTime(650, now);
                clickOsc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
                clickGain.gain.setValueAtTime(0.45, now);
                clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                clickOsc.connect(clickGain);
                clickGain.connect(this.ctx.destination);
                clickOsc.start(now);
                clickOsc.stop(now + 0.09);

                // Low electrical power surge hum
                const humOsc = this.ctx.createOscillator();
                const humGain = this.ctx.createGain();
                humOsc.type = 'sine';
                humOsc.frequency.setValueAtTime(60, now);
                humGain.gain.setValueAtTime(0.35, now);
                humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                humOsc.connect(humGain);
                humGain.connect(this.ctx.destination);
                humOsc.start(now);
                humOsc.stop(now + 0.4);
            } catch (e) { }
        },

        // 2. KNIFE SWITCH — Short realistic mechanical knife switch latch + metallic contact
        playTask2KnifeSwitch() {
            this.ensureContext();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                // Mechanical latch impact
                const metalOsc = this.ctx.createOscillator();
                const metalGain = this.ctx.createGain();
                metalOsc.type = 'square';
                metalOsc.frequency.setValueAtTime(1200, now);
                metalOsc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
                metalGain.gain.setValueAtTime(0.5, now);
                metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                metalOsc.connect(metalGain);
                metalGain.connect(this.ctx.destination);
                metalOsc.start(now);
                metalOsc.stop(now + 0.08);

                // Metallic contact snap
                const snapOsc = this.ctx.createOscillator();
                const snapGain = this.ctx.createGain();
                snapOsc.type = 'sawtooth';
                snapOsc.frequency.setValueAtTime(2400, now + 0.015);
                snapOsc.frequency.exponentialRampToValueAtTime(220, now + 0.09);
                snapGain.gain.setValueAtTime(0.35, now + 0.015);
                snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                snapOsc.connect(snapGain);
                snapGain.connect(this.ctx.destination);
                snapOsc.start(now + 0.015);
                snapOsc.stop(now + 0.09);
            } catch (e) { }
        },

        // 3. RESISTOR — Much more audible, realistic electrical load activation sound
        playTask3Resistor() {
            this.ensureContext();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const dur = 0.35;

                // 1. Primary electrical current load surge (punchy, deep 160Hz -> 360Hz)
                const flowOsc = this.ctx.createOscillator();
                const flowGain = this.ctx.createGain();
                const flowFilter = this.ctx.createBiquadFilter();

                flowOsc.type = 'sawtooth';
                flowOsc.frequency.setValueAtTime(160, now);
                flowOsc.frequency.exponentialRampToValueAtTime(360, now + dur);

                flowFilter.type = 'lowpass';
                flowFilter.frequency.setValueAtTime(1800, now);
                flowFilter.frequency.exponentialRampToValueAtTime(700, now + dur);
                flowFilter.Q.setValueAtTime(2.5, now);

                flowGain.gain.setValueAtTime(0.001, now);
                flowGain.gain.linearRampToValueAtTime(0.70, now + 0.04);
                flowGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                flowOsc.connect(flowFilter);
                flowFilter.connect(flowGain);
                flowGain.connect(this.ctx.destination);
                flowOsc.start(now);
                flowOsc.stop(now + dur);

                // 2. Secondary electrical load hum & current dissipation (sub-tone + bandpassed hiss)
                const humOsc = this.ctx.createOscillator();
                const humGain = this.ctx.createGain();
                const humFilter = this.ctx.createBiquadFilter();

                humOsc.type = 'triangle';
                humOsc.frequency.setValueAtTime(120, now);
                humOsc.frequency.linearRampToValueAtTime(240, now + dur * 0.7);

                humFilter.type = 'bandpass';
                humFilter.frequency.setValueAtTime(900, now);
                humFilter.Q.setValueAtTime(2.0, now);

                humGain.gain.setValueAtTime(0.001, now);
                humGain.gain.linearRampToValueAtTime(0.45, now + 0.03);
                humGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.7);

                humOsc.connect(humFilter);
                humFilter.connect(humGain);
                humGain.connect(this.ctx.destination);
                humOsc.start(now);
                humOsc.stop(now + dur * 0.7);
            } catch (e) { }
        },

        // 4. CAPACITOR — Continuous progressive charging sweep (low -> medium -> strong -> high)
        playCapacitorChargingSweep(durSec) {
            this.ensureContext();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const dur = durSec || 1.2;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.exponentialRampToValueAtTime(1600, now + dur);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(250, now);
                filter.frequency.exponentialRampToValueAtTime(4000, now + dur);

                gain.gain.setValueAtTime(0.04, now);
                gain.gain.linearRampToValueAtTime(0.38, now + dur * 0.9);
                gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + dur);
            } catch (e) { }
        },

        // 5. MAIN FINAL POWER RELEASE — TIGHT, SHORTER, DEEP POWERFUL "DURRRRRR" ELECTRICAL IMPACT SOUND (~1.0s)
        playFinalPowerReleaseImpact() {
            this.ensureContext();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const dur = 1.0; // Tightened from 1.8s to 1.0s for precise animation fit

                // Heavy Sawtooth Low-End Energy Release ("DURRRRRR")
                const powerOsc = this.ctx.createOscillator();
                const powerGain = this.ctx.createGain();
                const powerFilter = this.ctx.createBiquadFilter();

                powerOsc.type = 'sawtooth';
                powerOsc.frequency.setValueAtTime(200, now);
                powerOsc.frequency.exponentialRampToValueAtTime(38, now + dur);

                powerFilter.type = 'lowpass';
                powerFilter.frequency.setValueAtTime(750, now);
                powerFilter.frequency.exponentialRampToValueAtTime(110, now + dur);

                powerGain.gain.setValueAtTime(0.001, now);
                powerGain.gain.linearRampToValueAtTime(0.85, now + 0.08);
                powerGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                powerOsc.connect(powerFilter);
                powerFilter.connect(powerGain);
                powerGain.connect(this.ctx.destination);
                powerOsc.start(now);
                powerOsc.stop(now + dur);

                // Deep Sub-Bass Chest Impact Surge
                const subOsc = this.ctx.createOscillator();
                const subGain = this.ctx.createGain();

                subOsc.type = 'sine';
                subOsc.frequency.setValueAtTime(75, now);
                subOsc.frequency.exponentialRampToValueAtTime(20, now + dur);

                subGain.gain.setValueAtTime(0.001, now);
                subGain.gain.linearRampToValueAtTime(0.90, now + 0.06);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                subOsc.connect(subGain);
                subGain.connect(this.ctx.destination);
                subOsc.start(now);
                subOsc.stop(now + dur);

            } catch (e) { }
        },

        // 6. REALISTIC ORGANIC DRAGON ROAR (~2.4s TIGHTENED DURATION)
        triggerEpicCinematicDragonRoar() {
            this.ensureContext();
            if (!this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const dur = 2.4; // Tightened from 4.0s to 2.4s to fit naturally inside animation

                // 1. Organic Formant Throat Resonance + Pitch Sweep
                const roarOsc = this.ctx.createOscillator();
                const roarGain = this.ctx.createGain();
                const roarFilter = this.ctx.createBiquadFilter();

                roarOsc.type = 'sawtooth';
                roarOsc.frequency.setValueAtTime(110, now);
                roarOsc.frequency.exponentialRampToValueAtTime(260, now + 0.8);
                roarOsc.frequency.exponentialRampToValueAtTime(60, now + dur);

                roarFilter.type = 'lowpass';
                roarFilter.frequency.setValueAtTime(400, now);
                roarFilter.frequency.linearRampToValueAtTime(1200, now + 0.8);
                roarFilter.frequency.exponentialRampToValueAtTime(160, now + dur);
                roarFilter.Q.setValueAtTime(3.5, now);

                roarGain.gain.setValueAtTime(0.001, now);
                roarGain.gain.linearRampToValueAtTime(0.85, now + 0.5);
                roarGain.gain.setValueAtTime(0.85, now + 1.4);
                roarGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                roarOsc.connect(roarFilter);
                roarFilter.connect(roarGain);
                roarGain.connect(this.ctx.destination);
                roarOsc.start(now);
                roarOsc.stop(now + dur);

                // 2. Sub-bass Monster Chest Vibration
                const subOsc = this.ctx.createOscillator();
                const subGain = this.ctx.createGain();
                subOsc.type = 'sine';
                subOsc.frequency.setValueAtTime(75, now);
                subOsc.frequency.exponentialRampToValueAtTime(28, now + dur);

                subGain.gain.setValueAtTime(0.001, now);
                subGain.gain.linearRampToValueAtTime(0.75, now + 0.4);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                subOsc.connect(subGain);
                subGain.connect(this.ctx.destination);
                subOsc.start(now);
                subOsc.stop(now + dur);

                // 3. Layered Organic Noise Texture
                const bufferSize = this.ctx.sampleRate * dur;
                const noiseBuf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = noiseBuf.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.5;
                }
                const noiseSrc = this.ctx.createBufferSource();
                noiseSrc.buffer = noiseBuf;

                const noiseFilter = this.ctx.createBiquadFilter();
                noiseFilter.type = 'bandpass';
                noiseFilter.frequency.setValueAtTime(450, now);
                noiseFilter.frequency.linearRampToValueAtTime(1500, now + 0.8);
                noiseFilter.frequency.exponentialRampToValueAtTime(220, now + dur);
                noiseFilter.Q.setValueAtTime(1.8, now);

                const noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(0.001, now);
                noiseGain.gain.linearRampToValueAtTime(0.38, now + 0.5);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

                noiseSrc.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(this.ctx.destination);
                noiseSrc.start(now);
                noiseSrc.stop(now + dur);
            } catch (e) { }
        }
    };

    /* ═══════════════════════════════════════════════════
       ECE CIRCUIT CORE MINI-GAME ENGINE (STRICT LOCKED SPEC)
       ═══════════════════════════════════════════════════ */
    const ECECircuitCoreEngine = {
        canvas: null,
        ctx: null,
        shockwaveEl: null,
        wrapperEl: null,
        energyLevel: 0.0, // Initial state: NO electrical glow
        completedTasks: 0, // 0: OFF, 1: DC Source ON, 2: Knife Switch Closed, 3: Resistor Active, 4: Capacitor Charging
        active: false, // True during automatic finale animation
        nodes: [],
        pulses: [],
        lockedMsgTimer: null,

        init() {
            this.canvas = document.getElementById('dragonCoreCanvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.shockwaveEl = document.getElementById('dragonCoreShockwave');
            this.wrapperEl = document.getElementById('eceCircuitWrapper');

            DrakenCinematicAudioEngine.init();

            this.resize();
            window.addEventListener('resize', () => {
                this.resize();
                this.initNodes();
            });

            this.initNodes();

            // Component Click Handlers (DC Source -> Knife Switch -> Resistor -> Capacitor)
            const powerCard = document.getElementById('eceCompPower');
            const switchCard = document.getElementById('eceCompSwitch');
            const resistorCard = document.getElementById('eceCompResistor');
            const capCard = document.getElementById('eceCompCapacitor');

            if (powerCard) powerCard.addEventListener('click', () => this.handleComponentClick(1));
            if (switchCard) switchCard.addEventListener('click', () => this.handleComponentClick(2));
            if (resistorCard) resistorCard.addEventListener('click', () => this.handleComponentClick(3));
            if (capCard) capCard.addEventListener('click', () => this.handleComponentClick(4));

            this.animate();
        },

        resize() {
            if (!this.canvas || !this.canvas.parentElement) return;
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
        },

        initNodes() {
            const w = this.canvas.width;
            const h = this.canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const radius = Math.min(w, h) * 0.32;

            this.nodes = [
                { id: 'NODE-01', x: cx - radius, y: cy - radius * 0.5, radius: 18, active: false, label: 'DC SOURCE' },
                { id: 'NODE-02', x: cx + radius, y: cy - radius * 0.5, radius: 18, active: false, label: 'KNIFE SWITCH' },
                { id: 'NODE-03', x: cx - radius, y: cy + radius * 0.5, radius: 18, active: false, label: 'RESISTOR' },
                { id: 'NODE-04', x: cx + radius, y: cy + radius * 0.5, radius: 18, active: false, label: 'CAPACITOR' }
            ];

            this.pulses = [];
        },

        showSubtleLockedMessage() {
            const statusText = document.getElementById('coreStatusText');
            if (!statusText) return;

            if (this.lockedMsgTimer) clearTimeout(this.lockedMsgTimer);

            statusText.textContent = 'Complete the previous circuit step first.';
            statusText.style.color = '#ff6600';

            this.lockedMsgTimer = setTimeout(() => {
                if (statusText.textContent === 'Complete the previous circuit step first.') {
                    if (this.completedTasks === 0) {
                        statusText.textContent = 'POWERED DOWN';
                        statusText.style.color = 'var(--text-tertiary)';
                    } else if (this.completedTasks === 1) {
                        statusText.textContent = 'DC SOURCE ACTIVATED';
                        statusText.style.color = 'var(--orange-bright)';
                    } else if (this.completedTasks === 2) {
                        statusText.textContent = 'KNIFE SWITCH CLOSED';
                        statusText.style.color = 'var(--orange-bright)';
                    } else if (this.completedTasks === 3) {
                        statusText.textContent = 'RESISTOR ACTIVE';
                        statusText.style.color = 'var(--orange-bright)';
                    }
                }
            }, 2500);
        },

        handleComponentClick(stepIndex) {
            // Ignore touches during active finale animation
            if (this.active) return;

            const powerCard = document.getElementById('eceCompPower');
            const switchCard = document.getElementById('eceCompSwitch');
            const resistorCard = document.getElementById('eceCompResistor');
            const capCard = document.getElementById('eceCompCapacitor');

            const powerStatus = document.getElementById('ecePowerStatus');
            const switchStatus = document.getElementById('eceSwitchStatus');
            const resistorStatus = document.getElementById('eceResistorStatus');
            const capStatus = document.getElementById('eceCapacitorStatus');
            const capFill = document.getElementById('eceCapacitorFill');

            const statusDot = document.getElementById('coreStatusDot');
            const statusText = document.getElementById('coreStatusText');

            // LOCKED CHECK: Step touched out of order
            if (stepIndex > this.completedTasks + 1) {
                this.showSubtleLockedMessage();
                return;
            }

            // STEP 1 — DC SOURCE
            if (stepIndex === 1) {
                if (this.completedTasks === 0) {
                    this.completedTasks = 1;
                    this.energyLevel = 0.3;
                    if (this.nodes[0]) this.nodes[0].active = true;

                    if (powerCard) powerCard.classList.add('active');
                    if (powerStatus) powerStatus.textContent = 'ON';

                    if (switchCard) switchCard.classList.remove('locked');
                    if (switchStatus) switchStatus.textContent = 'OPEN';

                    if (statusDot) statusDot.classList.add('active');
                    if (statusText) {
                        statusText.textContent = 'DC SOURCE ACTIVATED';
                        statusText.style.color = 'var(--orange-bright)';
                    }

                    DrakenCinematicAudioEngine.playTask1PowerOn();
                    this.spawnPulses(6, 0.02);
                }
                return;
            }

            // STEP 2 — KNIFE SWITCH
            if (stepIndex === 2) {
                if (this.completedTasks === 1) {
                    this.completedTasks = 2;
                    this.energyLevel = 0.55;
                    if (this.nodes[1]) this.nodes[1].active = true;

                    if (switchCard) switchCard.classList.add('active');
                    if (switchStatus) switchStatus.textContent = 'CLOSED';

                    if (resistorCard) resistorCard.classList.remove('locked');
                    if (resistorStatus) resistorStatus.textContent = 'INACTIVE';

                    if (statusText) {
                        statusText.textContent = 'KNIFE SWITCH CLOSED';
                        statusText.style.color = 'var(--orange-bright)';
                    }

                    DrakenCinematicAudioEngine.playTask2KnifeSwitch();
                    this.spawnPulses(10, 0.022);
                }
                return;
            }

            // STEP 3 — RESISTOR
            if (stepIndex === 3) {
                if (this.completedTasks === 2) {
                    this.completedTasks = 3;
                    this.energyLevel = 0.75;
                    if (this.nodes[2]) this.nodes[2].active = true;

                    if (resistorCard) resistorCard.classList.add('active');
                    if (resistorStatus) resistorStatus.textContent = 'ACTIVE';

                    if (capCard) capCard.classList.remove('locked');
                    if (capStatus) capStatus.textContent = 'UNCHARGED';

                    if (statusText) {
                        statusText.textContent = 'RESISTOR ACTIVE';
                        statusText.style.color = 'var(--orange-bright)';
                    }

                    DrakenCinematicAudioEngine.playTask3Resistor();
                    this.spawnPulses(16, 0.028);
                }
                return;
            }

            // STEP 4 — CAPACITOR
            if (stepIndex === 4) {
                if (this.completedTasks === 3) {
                    this.completedTasks = 4;
                    if (this.nodes[3]) this.nodes[3].active = true;

                    if (capCard) capCard.classList.add('active');
                    if (capStatus) capStatus.textContent = 'CHARGING...';

                    if (statusText) {
                        statusText.textContent = 'CAPACITOR CHARGING...';
                        statusText.style.color = '#ffd700';
                    }

                    // Progressive charging sound sweep (1.2s)
                    DrakenCinematicAudioEngine.playCapacitorChargingSweep(1.2);

                    // Smooth fill bar ramp 0% -> 100%
                    let startTime = null;
                    const animateFill = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / 1200, 1.0);

                        if (capFill) capFill.style.width = `${(progress * 100).toFixed(0)}%`;
                        if (capStatus) capStatus.textContent = `${(progress * 100).toFixed(0)}% CHARGED`;
                        this.energyLevel = 0.75 + progress * 0.2;

                        if (progress < 1.0) {
                            requestAnimationFrame(animateFill);
                        } else {
                            // FULL CHARGE REACHED -> AUTOMATIC FINALE ANIMATION!
                            this.triggerAutomaticFinaleAnimation();
                        }
                    };
                    requestAnimationFrame(animateFill);
                }
                return;
            }
        },

        triggerAutomaticFinaleAnimation() {
            this.active = true;

            const powerCard = document.getElementById('eceCompPower');
            const switchCard = document.getElementById('eceCompSwitch');
            const resistorCard = document.getElementById('eceCompResistor');
            const capCard = document.getElementById('eceCompCapacitor');

            const powerStatus = document.getElementById('ecePowerStatus');
            const switchStatus = document.getElementById('eceSwitchStatus');
            const resistorStatus = document.getElementById('eceResistorStatus');
            const capStatus = document.getElementById('eceCapacitorStatus');
            const capFill = document.getElementById('eceCapacitorFill');

            const statusDot = document.getElementById('coreStatusDot');
            const statusText = document.getElementById('coreStatusText');

            // SHORT, TIGHT REAL MOBILE HAPTIC SYNCHRONIZATION (Build-up + Main Impact)
            if ("vibrate" in navigator) {
                try {
                    navigator.vibrate([40, 30, 220]); // Short build-up + brief strong impact
                } catch (e) { }
            }

            // 1. CAPACITOR FULL -> Energy Peak & ONE MAIN POWER RELEASE SOUND ("DURRRRRR", ~1.0s)
            this.nodes.forEach(n => n.active = true);
            this.energyLevel = 1.0;
            DrakenCinematicAudioEngine.playFinalPowerReleaseImpact();

            if (statusText) {
                statusText.textContent = 'DRAGON AWAKENED';
                statusText.style.color = 'var(--gold-bright)';
            }

            // 2. Lightning & Circuit Pulses
            setTimeout(() => {
                this.spawnPulses(35, 0.045);
                FullPageAtmosphereEngine.triggerLightning();
            }, 450);

            // 3. Shockwave Expansion
            setTimeout(() => {
                if (this.shockwaveEl) {
                    this.shockwaveEl.classList.remove('trigger');
                    void this.shockwaveEl.offsetWidth;
                    this.shockwaveEl.classList.add('trigger');
                }
            }, 700);

            // 4. Fire Eruption & Power Burst
            setTimeout(() => {
                if (this.wrapperEl) this.wrapperEl.classList.add('erupting');
                this.spawnPulses(45, 0.055);
            }, 950);

            // 5. REALISTIC SHORT DRAGON ROAR & BRIEF GROWL HAPTIC (~2.4s)
            setTimeout(() => {
                DrakenCinematicAudioEngine.triggerEpicCinematicDragonRoar();
                if ("vibrate" in navigator) {
                    try {
                        navigator.vibrate([80]);
                    } catch (e) { }
                }
            }, 1000);

            // 6. Sparks, Embers & Screen Shake
            setTimeout(() => {
                document.body.classList.add('screen-shake-effect');
                setTimeout(() => document.body.classList.remove('screen-shake-effect'), 450);
            }, 1200);

            // 7. AFTER FINAL ANIMATION — EVERYTHING TURNS OFF COMPLETELY! (~6.0s)
            setTimeout(() => {
                this.active = false;
                this.completedTasks = 0;
                this.energyLevel = 0.0; // ALL electrical glow OFF!

                // Turn off all nodes
                this.nodes.forEach(n => n.active = false);

                // Reset card UI states
                if (powerCard) {
                    powerCard.classList.remove('active', 'locked');
                }
                if (switchCard) {
                    switchCard.classList.remove('active');
                    switchCard.classList.add('locked');
                }
                if (resistorCard) {
                    resistorCard.classList.remove('active');
                    resistorCard.classList.add('locked');
                }
                if (capCard) {
                    capCard.classList.remove('active');
                    capCard.classList.add('locked');
                }

                if (powerStatus) powerStatus.textContent = 'OFF';
                if (switchStatus) switchStatus.textContent = 'OPEN (LOCKED)';
                if (resistorStatus) resistorStatus.textContent = 'INACTIVE (LOCKED)';
                if (capStatus) capStatus.textContent = 'UNCHARGED (LOCKED)';
                if (capFill) capFill.style.width = '0%';

                if (this.wrapperEl) this.wrapperEl.classList.remove('erupting');
                if (statusDot) statusDot.classList.remove('active');

                // Stop vibration
                if ('vibrate' in navigator) {
                    try { navigator.vibrate(0); } catch (e) { }
                }

                // Core Status shows ONLY: DRAGON AWAKENED
                if (statusText) {
                    statusText.textContent = 'DRAGON AWAKENED';
                    statusText.style.color = 'var(--gold-bright)';
                }
            }, 6000);
        },

        spawnPulses(count, speedBase) {
            const cx = this.canvas.width / 2;
            const cy = this.canvas.height / 2;
            for (let i = 0; i < count; i++) {
                const n = this.nodes[i % this.nodes.length];
                this.pulses.push({
                    startX: n.x,
                    startY: n.y,
                    targetX: cx,
                    targetY: cy,
                    progress: 0,
                    speed: Math.random() * speedBase + speedBase * 0.5,
                    size: Math.random() * 4 + 2
                });
            }
        },

        animate() {
            if (!this.ctx || !this.canvas) return;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const timeSec = performance.now() * 0.001;

            this.ctx.clearRect(0, 0, w, h);

            // 1. Draw PCB Ground Grid Lines
            this.ctx.strokeStyle = 'rgba(255, 102, 0, 0.08)';
            this.ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 40) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, h);
                this.ctx.stroke();
            }
            for (let y = 0; y < h; y += 40) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(w, y);
                this.ctx.stroke();
            }

            // 2. Draw PCB Copper Traces to Center Core
            this.nodes.forEach(node => {
                this.ctx.strokeStyle = node.active ? 'rgba(255, 170, 0, 0.85)' : 'rgba(255, 102, 0, 0.25)';
                this.ctx.lineWidth = node.active ? 3.5 : 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(node.x, cy);
                this.ctx.lineTo(cx, cy);
                this.ctx.stroke();
            });

            // 3. Draw Traveling Signal Pulses
            for (let i = this.pulses.length - 1; i >= 0; i--) {
                const p = this.pulses[i];
                p.progress += p.speed;
                const currentX = p.startX + (p.targetX - p.startX) * p.progress;
                const currentY = p.startY + (p.targetY - p.startY) * p.progress;

                this.ctx.fillStyle = '#ffd700';
                this.ctx.shadowColor = '#ff6600';
                this.ctx.shadowBlur = 12;
                this.ctx.beginPath();
                this.ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
                this.ctx.fill();

                if (p.progress >= 1) {
                    this.pulses.splice(i, 1);
                }
            }

            // Continuous signal pulse replenishment for ALREADY-POWERED circuit state
            const targetPulseCount = this.active ? 28 : 8;
            while (this.pulses.length < targetPulseCount && this.nodes.length > 0) {
                const n = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                this.pulses.push({
                    startX: n.x,
                    startY: n.y,
                    targetX: cx,
                    targetY: cy,
                    progress: 0,
                    speed: Math.random() * 0.015 + 0.008,
                    size: Math.random() * 3 + 1.8
                });
            }

            // 4. Draw Power Nodes
            this.nodes.forEach(node => {
                this.ctx.save();
                this.ctx.fillStyle = node.active ? '#ffaa00' : 'rgba(30, 16, 8, 0.9)';
                this.ctx.strokeStyle = node.active ? '#ffd700' : 'rgba(255, 102, 0, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#ffaa00';
                this.ctx.shadowBlur = node.active ? 20 : 0;

                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                // Node Label Text
                this.ctx.font = '10px Space Grotesk';
                this.ctx.fillStyle = '#ffffff';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(node.label, node.x, node.y + 3);
                this.ctx.restore();
            });

            // 5. DRAW CENTRAL DRAGON CORE & FIERY ERUPTION BURST
            this.ctx.save();
            const coreRadius = 45 + Math.sin(timeSec * 3) * 3 + this.energyLevel * 30;
            const coreGlow = this.ctx.createRadialGradient(cx, cy, 5, cx, cy, coreRadius * 2.2);

            if (this.energyLevel > 0.5) {
                coreGlow.addColorStop(0, 'rgba(255, 215, 0, 0.98)');
                coreGlow.addColorStop(0.4, 'rgba(255, 102, 0, 0.75)');
                coreGlow.addColorStop(1, 'rgba(6, 8, 12, 0)');
            } else {
                coreGlow.addColorStop(0, 'rgba(255, 102, 0, 0.6)');
                coreGlow.addColorStop(0.5, 'rgba(150, 50, 0, 0.25)');
                coreGlow.addColorStop(1, 'rgba(6, 8, 12, 0)');
            }

            this.ctx.fillStyle = coreGlow;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, coreRadius * 2.2, 0, Math.PI * 2);
            this.ctx.fill();

            // Core Solid Center
            this.ctx.fillStyle = '#ffd700';
            this.ctx.shadowColor = '#ff6600';
            this.ctx.shadowBlur = 25;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, coreRadius * 0.45, 0, Math.PI * 2);
            this.ctx.fill();

            // Core Outer Ring
            this.ctx.strokeStyle = '#ff6600';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.restore();

            requestAnimationFrame(() => this.animate());
        }
    };

    /* ═══════════════════════════════════════════════════
       FAQ SPARK / RIPPLE ENGINE
       ═══════════════════════════════════════════════════ */
    const FAQSparkEngine = {
        init() {
            document.addEventListener('click', (e) => {
                const item = e.target.closest('.faq-item');
                if (item) {
                    item.style.boxShadow = '0 0 30px rgba(255, 170, 0, 0.4)';
                    setTimeout(() => {
                        item.style.boxShadow = '';
                    }, 600);
                }
            });
        }
    };

    /* ═══════════════════════════════════════════════════
       INTERACTIVE GENERAL RULES ACCORDION ENGINE
       ═══════════════════════════════════════════════════ */
    const RulesAccordionEngine = {
        init() {
            const accordion = document.getElementById('rulesAccordion');
            if (!accordion) return;

            accordion.addEventListener('click', (e) => {
                const header = e.target.closest('.rules-category-header');
                if (!header) return;

                const card = header.closest('.rules-category-card');
                if (!card) return;

                const isAlreadyActive = card.classList.contains('active');

                // Collapse all categories for a clean single-open accordion feel
                const allCards = accordion.querySelectorAll('.rules-category-card');
                allCards.forEach(c => {
                    c.classList.remove('active');
                    const btn = c.querySelector('.rules-category-header');
                    const arrow = c.querySelector('.rules-category-arrow');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                    if (arrow) arrow.textContent = '＋';
                });

                // Open selected category if it was not already active
                if (!isAlreadyActive) {
                    card.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                    const arrow = card.querySelector('.rules-category-arrow');
                    if (arrow) arrow.textContent = '−';
                }
            });
        }
    };

    function init() {
        OpeningEngine.init();
        DragonECE3DEngine.init();
        FullPageAtmosphereEngine.init();
        ECECircuitCoreEngine.init();
        RulesAccordionEngine.init();
        FAQSparkEngine.init();
        Nav.init();
        if (window.Countdown) window.Countdown.init();
        if (window.Events) window.Events.init();
        if (window.Registration) window.Registration.init();
        renderFAQ();
        renderContacts();
        initLocation();
        initScrollReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
