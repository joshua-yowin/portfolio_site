'use strict';

/**
 * MODERN PORTFOLIO - JAVASCRIPT 2025 EDITION
 * Enhanced with ES6+ Features, Intersection Observer, and Performance Optimizations
 */

/*-----------------------------------*\
  #UTILITY FUNCTIONS
\*-----------------------------------*/

/**
 * Element toggle utility with smooth transitions
 * @param {HTMLElement} elem - Element to toggle
 */
const elementToggleFunc = (elem) => {
  elem.classList.toggle("active");
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/*-----------------------------------*\
  #SIDEBAR FUNCTIONALITY
\*-----------------------------------*/

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  // Toggle sidebar with smooth animation
  sidebarBtn.addEventListener("click", () => {
    elementToggleFunc(sidebar);
    
    // Add aria-expanded for accessibility
    const isExpanded = sidebar.classList.contains("active");
    sidebarBtn.setAttribute("aria-expanded", isExpanded);
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("active") && 
        !sidebar.contains(e.target) && 
        !sidebarBtn.contains(e.target)) {
      elementToggleFunc(sidebar);
      sidebarBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/*-----------------------------------*\
  #THEME TOGGLE (DARK/LIGHT MODE)
\*-----------------------------------*/

const themeToggle = document.querySelector("#themeToggle");
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Update theme icon
const updateThemeIcon = (theme) => {
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-sun', 'fa-moon');
      icon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
    }
  }
};

updateThemeIcon(currentTheme);

// Theme toggle event
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  });
}

/*-----------------------------------*\
  #TESTIMONIALS MODAL
\*-----------------------------------*/

const testimonialsItems = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// Modal content elements
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

/**
 * Toggle testimonials modal with accessibility
 */
const testimonialsModalFunc = () => {
  modalContainer?.classList.toggle("active");
  overlay?.classList.toggle("active");
  
  // Toggle body scroll
  document.body.classList.toggle("no-scroll");
  
  // Accessibility: Focus management
  if (modalContainer?.classList.contains("active")) {
    modalCloseBtn?.focus();
  }
};

// Add click event to all testimonial items
testimonialsItems.forEach((item) => {
  item.addEventListener("click", function() {
    const avatar = this.querySelector("[data-testimonials-avatar]");
    const title = this.querySelector("[data-testimonials-title]");
    const text = this.querySelector("[data-testimonials-text]");
    
    if (modalImg && avatar) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
    }
    
    if (modalTitle && title) {
      modalTitle.innerHTML = title.innerHTML;
    }
    
    if (modalText && text) {
      modalText.innerHTML = text.innerHTML;
    }
    
    testimonialsModalFunc();
  });
});

// Close modal events
modalCloseBtn?.addEventListener("click", testimonialsModalFunc);
overlay?.addEventListener("click", testimonialsModalFunc);

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalContainer?.classList.contains("active")) {
    testimonialsModalFunc();
  }
});

/*-----------------------------------*\
  #PORTFOLIO FILTER
\*-----------------------------------*/

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

// Toggle custom select dropdown
select?.addEventListener("click", function() {
  elementToggleFunc(this);
});

/**
 * Filter function with smooth animations
 * @param {String} selectedValue - Selected category value
 */
const filterFunc = (selectedValue) => {
  filterItems.forEach((item) => {
    const category = item.dataset.category;
    
    if (selectedValue === "all" || selectedValue === category) {
      // Use setTimeout for staggered animation effect
      setTimeout(() => {
        item.classList.add("active");
      }, 50);
    } else {
      item.classList.remove("active");
    }
  });
};

// Add event to all select items (mobile dropdown)
selectItems.forEach((item) => {
  item.addEventListener("click", function() {
    const selectedValue = this.innerText.toLowerCase();
    
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// Filter button functionality (desktop)
let lastClickedBtn = filterBtns[0];

filterBtns.forEach((btn) => {
  btn.addEventListener("click", function() {
    const selectedValue = this.innerText.toLowerCase();
    
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    
    filterFunc(selectedValue);
    
    // Update active state
    lastClickedBtn?.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// Close select dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (select?.classList.contains("active") && 
      !select.contains(e.target)) {
    elementToggleFunc(select);
  }
});

/*-----------------------------------*\
  #CONTACT FORM VALIDATION
\*-----------------------------------*/

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

/**
 * Validate form and enable/disable submit button
 */
const validateForm = () => {
  if (form?.checkValidity()) {
    formBtn?.removeAttribute("disabled");
  } else {
    formBtn?.setAttribute("disabled", "");
  }
};

// Add input event listeners with validation
formInputs.forEach((input) => {
  input.addEventListener("input", debounce(validateForm, 300));
  
  // Add visual feedback on blur
  input.addEventListener("blur", function() {
    if (this.value.trim() !== "") {
      this.classList.add("has-value");
    } else {
      this.classList.remove("has-value");
    }
  });
});

// Form submission with animation
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!form.checkValidity()) return;
  
  // Disable button and show loading state
  formBtn?.setAttribute("disabled", "");
  const originalText = formBtn?.innerHTML;
  
  if (formBtn) {
    formBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  }
  
  try {
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success feedback
    if (formBtn) {
      formBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    }
    
    // Reset form after delay
    setTimeout(() => {
      form.reset();
      if (formBtn) {
        formBtn.innerHTML = originalText;
      }
      formInputs.forEach(input => input.classList.remove("has-value"));
    }, 2000);
    
  } catch (error) {
    console.error("Form submission error:", error);
    
    // Error feedback
    if (formBtn) {
      formBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
    }
    
    setTimeout(() => {
      if (formBtn) {
        formBtn.innerHTML = originalText;
        formBtn.removeAttribute("disabled");
      }
    }, 2000);
  }
});

/*-----------------------------------*\
  #PAGE NAVIGATION
\*-----------------------------------*/

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

/**
 * Navigate to page with smooth transition
 * @param {String} pageName - Page name to navigate to
 */
const navigateToPage = (pageName) => {
  pages.forEach((page) => {
    if (pageName === page.dataset.page) {
      page.classList.add("active");
      
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      
      // Update page title
      document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Portfolio`;
    } else {
      page.classList.remove("active");
    }
  });
  
  // Update navigation link active state
  navigationLinks.forEach((link) => {
    const linkPage = link.innerHTML.toLowerCase();
    if (linkPage === pageName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

// Add event listeners to navigation links
navigationLinks.forEach((link) => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const pageName = this.innerHTML.toLowerCase();
    navigateToPage(pageName);
    
    // Update URL without page reload (optional)
    if (history.pushState) {
      history.pushState(null, null, `#${pageName}`);
    }
  });
});

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    navigateToPage(hash);
  } else {
    navigateToPage("about");
  }
});

// Initialize page based on URL hash
const initializePage = () => {
  const hash = window.location.hash.slice(1);
  if (hash && document.querySelector(`[data-page="${hash}"]`)) {
    navigateToPage(hash);
  } else {
    navigateToPage("about");
  }
};

/*-----------------------------------*\
  #HEADER SCROLL EFFECT
\*-----------------------------------*/

const header = document.getElementById("header");

const handleScroll = throttle(() => {
  if (window.scrollY > 100) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
}, 100);

window.addEventListener("scroll", handleScroll);

/*-----------------------------------*\
  #SCROLL TO TOP BUTTON
\*-----------------------------------*/

const scrollTopBtn = document.getElementById("scrollTop");

// Show/hide scroll to top button
const handleScrollTop = throttle(() => {
  if (window.scrollY > 500) {
    scrollTopBtn?.classList.add("visible");
  } else {
    scrollTopBtn?.classList.remove("visible");
  }
}, 100);

window.addEventListener("scroll", handleScrollTop);

// Scroll to top functionality
scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/*-----------------------------------*\
  #INTERSECTION OBSERVER - LAZY LOADING & ANIMATIONS
\*-----------------------------------*/

/**
 * Intersection Observer for lazy loading images
 */
const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add("loaded");
        }
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  },
  {
    rootMargin: "50px",
    threshold: 0.01
  }
);

// Observe all lazy-load images
const lazyImages = document.querySelectorAll("img[data-src]");
lazyImages.forEach((img) => imageObserver.observe(img));

/**
 * Intersection Observer for scroll animations
 */
const animateOnScroll = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  },
  {
    rootMargin: "0px",
    threshold: 0.1
  }
);

// Observe elements for animation
const animateElements = document.querySelectorAll("[data-animate]");
animateElements.forEach((el) => animateOnScroll.observe(el));

/*-----------------------------------*\
  #ACTIVE NAVIGATION ON SCROLL
\*-----------------------------------*/

/**
 * Update active navigation link based on scroll position
 */
const updateActiveNavOnScroll = throttle(() => {
  const sections = document.querySelectorAll("section[id]");
  let current = "";
  
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });
  
  navigationLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href")?.includes(current)) {
      link.classList.add("active");
    }
  });
}, 100);

window.addEventListener("scroll", updateActiveNavOnScroll);

/*-----------------------------------*\
  #SMOOTH SCROLL FOR ANCHOR LINKS
\*-----------------------------------*/

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    
    // Skip if it's just "#" or navigation link
    if (href === "#" || this.hasAttribute("data-nav-link")) {
      return;
    }
    
    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = header?.offsetHeight || 80;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  });
});

/*-----------------------------------*\
  #TYPING ANIMATION EFFECT
\*-----------------------------------*/

const typingTextElement = document.getElementById("typingText");

if (typingTextElement && typeof Typed !== 'undefined') {
  const typed = new Typed('#typingText', {
    strings: [
      'Software Developer',
      'AI/ML Engineer',
      'Cloud Architect',
      'Full-Stack Developer',
      'DevOps Engineer'
    ],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 2000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
}

/*-----------------------------------*\
  #SKILL PROGRESS ANIMATION
\*-----------------------------------*/

const skillProgressBars = document.querySelectorAll(".skill-progress-fill");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute("data-progress") || "0%";
        
        // Animate progress bar
        setTimeout(() => {
          progressBar.style.width = targetWidth;
        }, 100);
        
        skillObserver.unobserve(progressBar);
      }
    });
  },
  {
    threshold: 0.5
  }
);

skillProgressBars.forEach((bar) => skillObserver.observe(bar));

/*-----------------------------------*\
  #MOBILE MENU TOGGLE
\*-----------------------------------*/

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }
    
    // Toggle body scroll
    document.body.classList.toggle("no-scroll");
  });
  
  // Close menu when clicking on a link
  const mobileLinks = navLinks.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const icon = mobileMenuBtn.querySelector("i");
      
      if (icon) {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
      
      document.body.classList.remove("no-scroll");
    });
  });
}

/*-----------------------------------*\
  #PRELOADER (OPTIONAL)
\*-----------------------------------*/

const preloader = document.querySelector("[data-preloader]");

if (preloader) {
  window.addEventListener("load", () => {
    preloader.classList.add("hidden");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  });
}

/*-----------------------------------*\
  #INITIALIZE APP
\*-----------------------------------*/

/**
 * Initialize application
 */
const initApp = () => {
  console.log("🚀 Portfolio initialized successfully!");
  
  // Initialize page routing
  initializePage();
  
  // Add loaded class to body for CSS animations
  document.body.classList.add("loaded");
  
  // Initialize AOS if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    });
  }
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/*-----------------------------------*\
  #PERFORMANCE MONITORING (DEV ONLY)
\*-----------------------------------*/

if (performance && performance.getEntriesByType) {
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType("navigation")[0];
    
    if (perfData) {
      console.log("⚡ Performance Metrics:");
      console.log(`  DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
      console.log(`  Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
      console.log(`  Total Page Load: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
    }
  });
}

/*-----------------------------------*\
  #SERVICE WORKER (PWA SUPPORT - OPTIONAL)
\*-----------------------------------*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable PWA functionality
    // navigator.serviceWorker.register('/service-worker.js')
    //   .then(registration => {
    //     console.log('✅ ServiceWorker registered:', registration);
    //   })
    //   .catch(error => {
    //     console.log('❌ ServiceWorker registration failed:', error);
    //   });
  });
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    filterFunc,
    navigateToPage
  };
}
