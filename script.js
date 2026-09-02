/* ==========================================================================
   AAMEC TECH SYMPOSIUM 2026 - Master JavaScript (Vanilla JS ES6)
   ========================================================================== */

/**
 * GOOGLE APPS SCRIPT WEB APP ENDPOINT
 * Paste your deployed Google Apps Script Web App URL below.
 * Follow instructions in Code.gs or README.md to generate and deploy your Apps Script.
 */
const GOOGLE_SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation Hamburger Menu Toggle ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      if (navMenu.classList.contains('mobile-active')) {
        hamburgerIcon.className = 'fa-solid fa-xmark';
      } else {
        hamburgerIcon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        hamburgerIcon.className = 'fa-solid fa-bars';
      });
    });
  }

  // --- 2. Event Card "Register" Button Handling & Auto-Selection ---
  const eventButtons = document.querySelectorAll('.select-event-btn');
  const eventDropdown = document.getElementById('event');

  eventButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedEvent = button.getAttribute('data-event');
      
      // Pre-select the event in the registration form dropdown
      if (eventDropdown && selectedEvent) {
        eventDropdown.value = selectedEvent;
        
        // Remove error styling if user previously had an error on event selection
        clearFieldError('event');
      }

      // Smooth scroll down to the Registration section
      const registerSection = document.getElementById('register');
      if (registerSection) {
        registerSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- 3. Form Validation & Submission ---
  const registrationForm = document.getElementById('registrationForm');
  const successMessage = document.getElementById('successMessage');
  const registerAnotherBtn = document.getElementById('registerAnotherBtn');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');

  // Input Field References
  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    college: document.getElementById('college'),
    department: document.getElementById('department'),
    year: document.getElementById('year'),
    event: document.getElementById('event')
  };

  // Add real-time input event listeners to clear error messages as user types
  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      fields[key].addEventListener('input', () => clearFieldError(key));
      fields[key].addEventListener('change', () => clearFieldError(key));
    }
  });

  // Validation Logic
  function validateForm() {
    let isValid = true;

    // 1. Full Name Validation
    if (!fields.fullName.value.trim()) {
      showFieldError('fullName', 'Please enter your full name.');
      isValid = false;
    } else if (fields.fullName.value.trim().length < 2) {
      showFieldError('fullName', 'Name must be at least 2 characters long.');
      isValid = false;
    }

    // 2. Email Validation (Regex Check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.value.trim()) {
      showFieldError('email', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(fields.email.value.trim())) {
      showFieldError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    // 3. Phone Number Validation (10 Digits Numeric)
    const phoneRegex = /^[0-9]{10}$/;
    if (!fields.phone.value.trim()) {
      showFieldError('phone', 'Please enter your 10-digit phone number.');
      isValid = false;
    } else if (!phoneRegex.test(fields.phone.value.trim())) {
      showFieldError('phone', 'Phone number must contain exactly 10 digits.');
      isValid = false;
    }

    // 4. College Name Validation
    if (!fields.college.value.trim()) {
      showFieldError('college', 'Please enter your college name.');
      isValid = false;
    }

    // 5. Department Validation
    if (!fields.department.value.trim()) {
      showFieldError('department', 'Please enter your department.');
      isValid = false;
    }

    // 6. Year of Study Validation
    if (!fields.year.value) {
      showFieldError('year', 'Please select your year of study.');
      isValid = false;
    }

    // 7. Event Selection Validation
    if (!fields.event.value) {
      showFieldError('event', 'Please select an event to register.');
      isValid = false;
    }

    return isValid;
  }

  // Helper function to display field-specific error message
  function showFieldError(fieldKey, message) {
    const field = fields[fieldKey];
    if (!field) return;
    const parentGroup = field.closest('.form-group');
    const errorSpan = document.getElementById(`${fieldKey}Error`);

    if (parentGroup) parentGroup.classList.add('error');
    if (errorSpan) errorSpan.textContent = message;
  }

  // Helper function to clear field error
  function clearFieldError(fieldKey) {
    const field = fields[fieldKey];
    if (!field) return;
    const parentGroup = field.closest('.form-group');
    const errorSpan = document.getElementById(`${fieldKey}Error`);

    if (parentGroup) parentGroup.classList.remove('error');
    if (errorSpan) errorSpan.textContent = '';
  }

  // Form Submit Handler
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Perform validation
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    // Prepare submission data payload
    const formDataPayload = {
      fullName: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      college: fields.college.value.trim(),
      department: fields.department.value.trim(),
      year: fields.year.value,
      event: fields.event.value,
      timestamp: new Date().toISOString()
    };

    // UI Loading State
    submitBtn.disabled = true;
    btnText.textContent = "Submitting Registration...";
    btnIcon.className = "fa-solid fa-circle-notch fa-spin";

    try {
      // Send data to Google Apps Script Endpoint (if configured)
      if (GOOGLE_SHEET_ENDPOINT && GOOGLE_SHEET_ENDPOINT !== "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
        await fetch(GOOGLE_SHEET_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors', // Standard cross-origin setting for Google Apps Script Web Apps
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(formDataPayload)
        });
      } else {
        console.warn("Google Sheet Endpoint not set yet. Simulating submission locally.");
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
      }

      // Display Success Message & Hide Form
      registrationForm.style.display = 'none';
      successMessage.style.display = 'block';

      // Reset form fields
      registrationForm.reset();

    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting your registration. Please try again.");
    } finally {
      // Restore Button UI State
      submitBtn.disabled = false;
      btnText.textContent = "Submit Registration";
      btnIcon.className = "fa-solid fa-paper-plane";
    }
  });

  // "Register Another Participant" Button Handler
  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener('click', () => {
      successMessage.style.display = 'none';
      registrationForm.style.display = 'flex';
      
      // Clear all error states
      Object.keys(fields).forEach(key => clearFieldError(key));
    });
  }

});
