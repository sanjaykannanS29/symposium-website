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
        duration: 4800, // 4.8s smooth visual transition
        completed: false,

        init() {
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

            /* ── VISUAL TIMELINE SEQUENCE ─────────────────────────────
               0.0s – 1.2s : Darkness, subtle mist & embers
               1.2s – 2.6s : Ambient light swell & particle drift
               2.6s – 3.8s : DRAKEN'26 revealed with glowing depth
               3.8s – 4.8s : Seamless continuous dissolve into homepage hero
               ────────────────────────────────────────────────────────── */

            let bgAlpha = 1;
            let glowIntensity = 0;
            let titleOpacity = 0;

            if (elapsed < 1200) {
                bgAlpha = 1;
                glowIntensity = 0;
                titleOpacity = 0;
            } else if (elapsed < 2600) {
                const p = (elapsed - 1200) / 1400;
                bgAlpha = 1;
                glowIntensity = p * 0.65;
                titleOpacity = p * 0.4;
            } else if (elapsed < 3800) {
                const p = (elapsed - 2600) / 1200;
                bgAlpha = 1;
                glowIntensity = 0.65 + Math.sin(p * Math.PI) * 0.35;
                titleOpacity = 1;
            } else if (elapsed < 4800) {
                const p = (elapsed - 3800) / 1000;
                bgAlpha = 1 - p;
                glowIntensity = 1.0 * (1 - p);
                titleOpacity = 1 - p;

                // Awaken hero content for seamless continuous handoff
                const heroContent = document.getElementById('heroContent');
                if (heroContent && !heroContent.classList.contains('awakened')) {
                    heroContent.classList.add('awakened');
                }
            } else {
                bgAlpha = 0;
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

            // 3. Render Center Ambient Orange Light Glow
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

            // 5. Title Reveal: DRAKEN'26 ONLY (No subtitles, no dates, no images)
            if (titleOpacity > 0 && bgAlpha > 0.02) {
                this.ctx.save();
                this.ctx.translate(w / 2, h / 2 - 40);

                const fontSize = Math.min(w * 0.115, 98);
                this.ctx.font = `800 ${fontSize}px "Space Grotesk", sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                this.ctx.shadowColor = 'rgba(255, 85, 0, 0.95)';
                this.ctx.shadowBlur = 50;

                this.ctx.fillStyle = `rgba(255, 255, 255, ${titleOpacity * bgAlpha})`;
                this.ctx.fillText("DRAKEN'26", 0, 0);

                this.ctx.restore();
            }

            // Finish transition at 4.8s
            if (elapsed >= 4800 && !this.completed) {
                this.completed = true;
                this.finish();
                return;
            }

            if (elapsed < 4800) {
                this.animFrame = requestAnimationFrame((n) => this.animate(n));
            }
        },

        finish() {
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
        if (!container || !config || !config.RULES) return;

        container.innerHTML = config.RULES.map((rule) => `
            <div class="rules-item">
                <span class="rules-icon">✓</span>
                <p class="rules-text">${rule}</p>
            </div>
        `).join('');
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
                    color: Math.random() < 0.75 ? '#ff6600' : '#00ffea',
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

            // ── LAYER 2: PRIMARY VISUAL SUBJECT — PROMINENT 3D DRAGON ───────────
            if (!this.isMobile) {
                const dragonX = w * 0.78;
                const dragonY = h * 0.32;
                const eyePulse = (Math.sin(timeSec * 0.8) * 0.5 + 0.5);

                this.ctx.save();

                // 2A. Dragon Body & Wing Silhouette Fill
                this.ctx.fillStyle = 'rgba(12, 12, 18, 0.88)';
                this.ctx.strokeStyle = 'rgba(255, 95, 0, 0.45)';
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

                // 2B. Dragon Scale Plates & Metallic Rim Lighting Highlights
                this.ctx.strokeStyle = 'rgba(255, 125, 20, 0.55)';
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

                // 2C. PROMINENT GLOWING DRAGON EYE (Main Focal Point)
                const eyeX = dragonX - 150;
                const eyeY = dragonY - 45;

                // Eye Fire Radial Illumination Glow
                const eyeGlowGrad = this.ctx.createRadialGradient(eyeX, eyeY, 2, eyeX, eyeY, 80);
                eyeGlowGrad.addColorStop(0, `rgba(255, 80, 0, ${0.4 + eyePulse * 0.3})`);
                eyeGlowGrad.addColorStop(0.4, `rgba(220, 40, 0, ${0.2 + eyePulse * 0.15})`);
                eyeGlowGrad.addColorStop(1, 'rgba(5, 5, 7, 0)');
                this.ctx.fillStyle = eyeGlowGrad;
                this.ctx.beginPath();
                this.ctx.arc(eyeX, eyeY, 80, 0, Math.PI * 2);
                this.ctx.fill();

                // Eye Socket Slit & Iris
                this.ctx.fillStyle = '#ffaa00';
                this.ctx.shadowColor = '#ff5500';
                this.ctx.shadowBlur = 18;
                this.ctx.beginPath();
                this.ctx.ellipse(eyeX, eyeY, 14, 8, -Math.PI / 6, 0, Math.PI * 2);
                this.ctx.fill();

                // Vertical Slit Pupil
                this.ctx.fillStyle = '#050507';
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
                this.ctx.strokeStyle = 'rgba(255, 85, 0, 0.06)';
                this.ctx.beginPath();
                this.ctx.moveTo(trace.startX, 0);

                let lastX = trace.startX;
                trace.points.forEach(pt => {
                    this.ctx.lineTo(lastX, pt.y - 20);
                    this.ctx.lineTo(pt.x, pt.y);
                    lastX = pt.x;

                    // Small PCB Node Pad
                    this.ctx.fillStyle = 'rgba(255, 85, 0, 0.1)';
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
                    this.ctx.fillStyle = 'rgba(18, 18, 26, 0.35)';
                    this.ctx.strokeStyle = 'rgba(255, 85, 0, 0.22)';
                    this.ctx.lineWidth = 1.2;
                    this.ctx.fillRect(-chip.size / 2, -chip.size / 2, chip.size, chip.size);
                    this.ctx.strokeRect(-chip.size / 2, -chip.size / 2, chip.size, chip.size);

                    // Microchip Pin Arrays
                    this.ctx.fillStyle = 'rgba(255, 120, 0, 0.35)';
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

            // ── LAYER 6: Controlled Fire Plumes (Reduced 65% for 15% Fire Lighting) ─────
            this.risingFlames.forEach(f => {
                f.y += f.vy;
                f.x += Math.sin(timeSec * 2 + f.waveOffset) * 0.7 + f.vx;
                f.life -= f.decay;

                if (f.life <= 0 || f.y < -50) {
                    f.x = Math.random() * w;
                    f.y = h + Math.random() * 30;
                    f.radius = Math.random() * 24 + 10;
                    f.alpha = Math.random() * 0.28 + 0.12;
                    f.life = 1.0;
                }

                const currentRadius = f.radius * f.life;
                const currentAlpha = f.alpha * f.life;

                const flameGrad = this.ctx.createRadialGradient(
                    f.x, f.y, 2,
                    f.x, f.y, Math.max(currentRadius, 4)
                );
                flameGrad.addColorStop(0, `rgba(255, 190, 40, ${currentAlpha * 0.85})`);
                flameGrad.addColorStop(0.4, `rgba(255, 85, 0, ${currentAlpha * 0.6})`);
                flameGrad.addColorStop(0.8, `rgba(180, 25, 0, ${currentAlpha * 0.25})`);
                flameGrad.addColorStop(1, 'rgba(5, 5, 7, 0)');

                this.ctx.fillStyle = flameGrad;
                this.ctx.beginPath();
                this.ctx.arc(f.x, f.y, Math.max(currentRadius, 4), 0, Math.PI * 2);
                this.ctx.fill();
            });

            // ── LAYER 7: Floating Embers & Sparks (5% Composition) ──────────────
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
                    this.ctx.fillStyle = `rgba(255, 140, 40, ${currentAlpha})`;
                    this.ctx.shadowColor = 'rgba(255, 85, 0, 0.8)';
                    this.ctx.shadowBlur = 6;
                } else {
                    this.ctx.fillStyle = `rgba(255, 85, 0, ${currentAlpha})`;
                    this.ctx.shadowBlur = 0;
                }
                this.ctx.fill();
            });

            this.animFrame = requestAnimationFrame((n) => this.animate(n));
        }
    };

    function init() {
        OpeningEngine.init();
        DragonECE3DEngine.init();
        Nav.init();
        if (window.Countdown) window.Countdown.init();
        if (window.Events) window.Events.init();
        if (window.Registration) window.Registration.init();
        renderRules();
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
