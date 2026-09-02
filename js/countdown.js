/**
 * DRAKEN'26 — Countdown Timer
 * Dynamically counts down to 26 September 2026 (IST timezone).
 */

const Countdown = {
    interval: null,

    init() {
        this.update();
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.update(), 1000);
    },

    update() {
        // Target: 26 September 2026 09:00:00 IST (+05:30)
        const targetStr = (window.CONFIG && window.CONFIG.COUNTDOWN_DATE) 
            ? window.CONFIG.COUNTDOWN_DATE 
            : '2026-09-26T09:00:00+05:30';

        const target = new Date(targetStr).getTime();
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            this.setVal('countdownDays', '00');
            this.setVal('countdownHours', '00');
            this.setVal('countdownMinutes', '00');
            this.setVal('countdownSeconds', '00');
            if (this.interval) clearInterval(this.interval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.setVal('countdownDays', this.pad(days));
        this.setVal('countdownHours', this.pad(hours));
        this.setVal('countdownMinutes', this.pad(minutes));
        this.setVal('countdownSeconds', this.pad(seconds));
    },

    pad(n) {
        return n < 10 ? '0' + Math.max(0, n) : String(n);
    },

    setVal(id, val) {
        const el = document.getElementById(id);
        if (el && el.textContent !== val) {
            el.textContent = val;
        }
    }
};

// Make Countdown explicitly available globally
window.Countdown = Countdown;
