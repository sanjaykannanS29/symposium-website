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

    function init() {
        OpeningEngine.init();
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
