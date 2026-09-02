# DRAKEN'26 — National Level Technical Symposium Website

Official website for **DRAKEN'26**, the National Level Technical Symposium organized by the Department of Electronics and Communication Engineering (ECE) at **Anjalai Ammal Mahalingam Engineering College (AAMEC)**.

**Event Date:** 26 September 2026

---

## Technical Stack & Architecture

- **Frontend:** Pure HTML5, Vanilla CSS3 (Black Canvas Design System), Modular ES6+ JavaScript
- **Backend:** Google Apps Script + Google Sheets (Serverless API)
- **Deployment:** Vercel / GitHub Pages / Static Hosting

---

## Directory Structure

```
symposium-website/
├── index.html                  # Main single-page application
├── css/
│   ├── styles.css              # Black canvas design system & components
│   └── responsive.css          # Breakpoints (1200 / 992 / 768 / 576 / 400px)
├── js/
│   ├── config.js               # Centralized data (events, contacts, FAQ, endpoint)
│   ├── main.js                 # App init, dragon intro, navigation, scroll reveal
│   ├── countdown.js            # Live countdown timer
│   ├── events.js               # Event cards renderer & interactive modal system
│   ├── registration.js         # Multi-step registration form & step validation
│   └── validation.js           # Input validation utilities
├── assets/
│   ├── images/                 # College logo & visual assets
│   └── audio/                  # Intro cinematic audio (intro.mp3)
├── Code.gs                     # Google Apps Script backend template
└── README.md                   # Project documentation
```

---

## Key Features

1. **Dragon Awakening Intro:**
   - 3-5 second cinematic opening with SVG path drawing animation.
   - Smooth transition into main hero upon clicking `ENTER DRAKEN'26`.
   - Handles audio autoplay restrictions gracefully.

2. **Black Canvas Aesthetic:**
   - Deep black backgrounds (`#0a0a0a`), Playfair Display typography, subtle gold accents (`#c9a84c`).
   - Zero glassmorphism, no neon clutter, ultra-clean editorial aesthetic.

3. **Multi-Step Registration:**
   - Guided flow: Team Name → Tech Event → Non-Tech Event → Member 1 → Member 2 → Confirm.
   - AAMEC Auto-detection (College Code `8204`) vs Other College entry.
   - Live review step & rules acknowledgement before submission.

4. **Google Apps Script Backend Integration:**
   - Race-condition safe with `LockService`.
   - Capacity enforcement: 60 teams overall (20 AAMEC / 40 Other College slots).
   - Duplicate prevention for Team Name, Register Number, and Email.
   - Auto confirmation email to both team members containing Registration ID.

---

## Setting Up Google Apps Script (Backend)

1. Open a new Google Sheet.
2. Go to **Extensions** → **Apps Script**.
3. Copy the contents of `Code.gs` into the editor.
4. Click **Deploy** → **New Deployment**.
5. Select **Web app**:
   - *Execute as:* `Me`
   - *Who has access:* `Anyone`
6. Copy the generated Web App URL.
7. Open `js/config.js` and paste the URL into `API_URL`:
   ```js
   API_URL: 'https://script.google.com/macros/s/.../exec',
   ```

---

## Local Development & Testing

You can serve the directory with any local HTTP server:

```bash
npx serve .
```

Or deploy directly to Vercel:

```bash
vercel
```
