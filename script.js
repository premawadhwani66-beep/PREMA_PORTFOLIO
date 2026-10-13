/**
 * Portfolio JavaScript - Prema Wadhwani
 * Handles Theme Toggling, Mobile Navigation, Scroll Spy, 
 * Clipboard Operations, and Contact Form Interactions.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // --- Constants & Selectors ---
  const EMAIL_ADDRESS = 'premawadhwani09@gmail.com';
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const currentYearSpan = document.getElementById('currentYear');
  const copyHeroBtn = document.getElementById('copyEmailHeroBtn');
  const copyContactBtn = document.getElementById('copyEmailContactBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  // --- Dynamic Current Year ---
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ===================================================================
  // 1. Theme Management (Dark / Light Mode)
  // ===================================================================
  const THEME_KEY = 'prema_portfolio_theme';

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // Graceful fallback if localStorage is disabled in strict local modes
    }
  };

  // Determine initial theme
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // Fallback
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  };

  // Set initial theme
  applyTheme(getInitialTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // ===================================================================
  // 2. Mobile Hamburger Navigation
  // ===================================================================
  const toggleMobileMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  };

  const closeMobileMenu = () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile nav when clicking a link
  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburgerBtn) {
      closeMobileMenu();
    }
  });

  // ===================================================================
  // 3. Scroll Interactions (Header shadow, Back to Top, ScrollSpy)
  // ===================================================================
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header shadow styling
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // ScrollSpy: active link highlight
    const sections = document.querySelectorAll('main section[id]');
    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navItems.forEach((item) => {
        const href = item.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger once on page load

  // Smooth scroll back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===================================================================
  // 4. Toast Notifications & Clipboard Copy
  // ===================================================================
  let toastTimeout;
  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  const copyEmailToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL_ADDRESS)
        .then(() => {
          showToast(`Copied ${EMAIL_ADDRESS} to clipboard!`);
        })
        .catch(() => {
          fallbackCopyText(EMAIL_ADDRESS);
        });
    } else {
      fallbackCopyText(EMAIL_ADDRESS);
    }
  };

  const fallbackCopyText = (text) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
  };

  if (copyHeroBtn) {
    copyHeroBtn.addEventListener('click', copyEmailToClipboard);
  }

  if (copyContactBtn) {
    copyContactBtn.addEventListener('click', copyEmailToClipboard);
  }

  // ===================================================================
  // 5. Contact Form Client-side Validation & Feedback
  // ===================================================================
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    };

    const clearErrors = () => {
      [nameError, emailError, messageError].forEach((el) => {
        if (el) {
          el.textContent = '';
          el.classList.remove('visible');
        }
      });
      [nameInput, emailInput, messageInput].forEach((input) => {
        if (input) input.style.borderColor = '';
      });
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        isValid = false;
        nameError.textContent = 'Please enter your name (at least 2 characters).';
        nameError.classList.add('visible');
        nameInput.style.borderColor = 'var(--accent-rose)';
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        isValid = false;
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.add('visible');
        emailInput.style.borderColor = 'var(--accent-rose)';
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        isValid = false;
        messageError.textContent = 'Please enter a message (at least 8 characters).';
        messageError.classList.add('visible');
        messageInput.style.borderColor = 'var(--accent-rose)';
      }

      if (isValid) {
        const senderName = nameInput.value.trim();
        
        // Show success banner
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
        }
        
        showToast(`Thank you, ${senderName}! Message received.`);
        contactForm.reset();

        // Hide success message after 7 seconds
        setTimeout(() => {
          if (formSuccessMessage) {
            formSuccessMessage.classList.add('hidden');
          }
        }, 7000);
      }
    });

    // Real-time cleanup of error message on input typing
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          const correspondingError = document.getElementById(`${input.id}Error`);
          if (correspondingError) {
            correspondingError.textContent = '';
            correspondingError.classList.remove('visible');
          }
        });
      }
    });
  }
});
