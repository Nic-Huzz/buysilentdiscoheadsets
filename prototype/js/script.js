// Silent Disco Headsets - Interactive Elements

// ==================== //
// BRAND LOGO VIDEO ON HOVER/TAP
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const brandLogos = document.querySelectorAll('.brand-logo');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  brandLogos.forEach(logo => {
    const video = logo.querySelector('.brand-video');

    if (video) {
      // Click functionality for both mobile and desktop
      logo.addEventListener('click', (e) => {
        // Close other videos
        brandLogos.forEach(otherLogo => {
          if (otherLogo !== logo) {
            otherLogo.classList.remove('active');
            const otherVideo = otherLogo.querySelector('.brand-video');
            if (otherVideo) {
              otherVideo.pause();
              otherVideo.currentTime = 0;
            }
          }
        });

        // Toggle current video
        const isActive = logo.classList.contains('active');
        if (isActive) {
          logo.classList.remove('active');
          video.pause();
          video.currentTime = 0;
        } else {
          logo.classList.add('active');
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      });

      // Desktop: Also support hover
      if (!isTouchDevice) {
        logo.addEventListener('mouseenter', () => {
          if (!logo.classList.contains('active')) {
            logo.classList.add('active');
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        });

        logo.addEventListener('mouseleave', () => {
          logo.classList.remove('active');
          video.pause();
          video.currentTime = 0;
        });
      }
    }
  });
});

// ==================== //
// FAQ ACCORDION
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
});

// ==================== //
// TESTIMONIALS CAROUSEL
// ==================== //
const testimonials = [
  {
    text: "Absolutely incredible team and service! I already worked with them at least for 10 events that I hosted. Not a single problem! The sound quality was top-notch which made a huge difference for our event. What truly sets them apart for me is how easy and professional they are to work with.",
    author: "Event Host",
    role: "Bali, Indonesia",
    image: "images/testimonials/testimonial-1.jpg",
    video: null // Set to video path if available: "images/testimonials/testimonial-1.mp4"
  },
  {
    text: "Bali Silent Headphones Uluwatu is a beautiful business run by genuinely wonderful people. Their energy lifted me up and made the entire experience even more special. I am so grateful for everything they did to help me share my music in such a meaningful way.",
    author: "Musician & Artist",
    role: "Bali, Indonesia",
    image: "images/testimonials/testimonial-2.jpg",
    video: null
  },
  {
    text: "I'm not a big dancer, but using these headsets at a party I found myself dancing more than I ever have. It's like the headsets puts you in your own little world. The sound quality is amazing!",
    author: "Silent Disco Attendee",
    role: "Bali, Indonesia",
    image: "images/testimonials/testimonial-3.jpg",
    video: null
  },
  {
    text: "Nic was an absolute pleasure to work with. I'm so happy I found him when I was in Bali. He was responsive and was able to meet all my needs, and for a great price. He's definitely the go-to guy for all your silent disco needs 🎧 🕺🏻 🪩",
    author: "Happy Customer",
    role: "Bali, Indonesia",
    image: "images/testimonials/testimonial-4.jpg",
    video: null
  },
  {
    text: "Super sound quality headsets, one of my best nights in Bali. There's nothing better than these sweet silent discos- straight up vibes from your ears to your feet. Thanks Huzz!",
    author: "Party Enthusiast",
    role: "Bali, Indonesia",
    image: "images/testimonials/testimonial-5.jpg",
    video: null
  }
];

let currentTestimonial = 0;

function updateTestimonial(index) {
  const testimonial = testimonials[index];
  const card = document.querySelector('.testimonial-card');

  // Add fade out effect
  card.style.opacity = '0';

  setTimeout(() => {
    // Generate media HTML (image or video)
    const mediaHTML = testimonial.video
      ? `<video class="testimonial-video" autoplay loop muted playsinline>
           <source src="${testimonial.video}" type="video/mp4">
         </video>`
      : `<img src="${testimonial.image}" alt="${testimonial.author}" class="testimonial-image">`;

    card.innerHTML = `
      <div class="testimonial-media">
        ${mediaHTML}
      </div>
      <div class="testimonial-content">
        <p class="testimonial-text">"${testimonial.text}"</p>
        <div class="testimonial-author">${testimonial.author}</div>
        <div class="testimonial-role">${testimonial.role}</div>
      </div>
    `;

    // Fade in
    card.style.opacity = '1';
  }, 300);

  // Update active dot
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  currentTestimonial = index;
}

// Carousel dot navigation
document.addEventListener('DOMContentLoaded', function() {
  const dots = document.querySelectorAll('.carousel-dot');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      updateTestimonial(index);
    });
  });

  // Auto-rotate testimonials every 5 seconds
  setInterval(() => {
    const nextIndex = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial(nextIndex);
  }, 5000);
});

// ==================== //
// SMOOTH SCROLLING
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // Only prevent default for anchor links, not empty hrefs
    if (href !== '#' && href.length > 1) {
      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ==================== //
// HEADER SCROLL EFFECT
// ==================== //
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // Add shadow when scrolled
  if (currentScroll > 0) {
    header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
  }

  lastScroll = currentScroll;
});

// ==================== //
// MOBILE MENU TOGGLE
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
});

// ==================== //
// NEWSLETTER FORM
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const email = emailInput.value;
      const submitBtn = newsletterForm.querySelector('.newsletter-btn');

      // Simple validation
      if (email && email.includes('@')) {
        submitBtn.textContent = 'Subscribed!';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        emailInput.value = '';
        setTimeout(() => {
          submitBtn.textContent = 'Subscribe';
          submitBtn.style.background = '';
        }, 3000);
      } else {
        submitBtn.textContent = 'Invalid email';
        submitBtn.style.background = '#ef4444';
        setTimeout(() => {
          submitBtn.textContent = 'Subscribe';
          submitBtn.style.background = '';
        }, 2000);
      }
    });
  }
});

// ==================== //
// ADD TO CART BUTTONS
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const packageButtons = document.querySelectorAll('.package-card button');

  packageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const packageCard = button.closest('.package-card');
      const packageName = packageCard.querySelector('h3').textContent;

      // Simulate add to cart action
      button.innerHTML = '✓ Added to Cart';
      button.style.background = 'linear-gradient(135deg, #5e17eb, #8b5cf6)';
      button.style.color = 'white';
      button.style.border = 'none';

      setTimeout(() => {
        const originalText = button.textContent.includes('Quote') ? 'Get Quote' :
                            button.textContent.includes('Contact') ? 'Contact Us' :
                            'Select Package';
        button.innerHTML = originalText;
        button.style.background = '';
        button.style.color = '';
        button.style.border = '';
      }, 2000);

    });
  });
});

// ==================== //
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Animate sections on scroll
  const sections = document.querySelectorAll('.section, .section-sm');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});

// ==================== //
// WHY USE HEADSETS SLIDER
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.why-tab');
  const slides = document.querySelectorAll('.why-slide');
  const indicators = document.querySelectorAll('.why-indicator');
  let currentSlide = 0;
  let autoSlideInterval;
  let userInteracted = false;

  // Function to switch to a specific slide
  function goToSlide(index) {
    // Remove active class from all elements
    tabs.forEach(tab => tab.classList.remove('active'));
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current elements
    tabs[index].classList.add('active');
    slides[index].classList.add('active');
    indicators[index].classList.add('active');

    currentSlide = index;
  }

  // Function to go to next slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  // Auto-slide functionality
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      // Only auto-slide if user hasn't interacted in the last 10 seconds
      if (!userInteracted) {
        nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }

  // Reset user interaction flag after 10 seconds
  function resetUserInteraction() {
    userInteracted = true;
    setTimeout(() => {
      userInteracted = false;
    }, 10000);
  }

  // Tab click handlers
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      goToSlide(index);
      resetUserInteraction();
    });
  });

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
      resetUserInteraction();
    });
  });

  // Start auto-sliding
  startAutoSlide();

  // Pause auto-slide when user hovers over the slider
  const sliderSection = document.querySelector('.why-headsets');
  if (sliderSection) {
    sliderSection.addEventListener('mouseenter', () => {
      userInteracted = true;
    });

    sliderSection.addEventListener('mouseleave', () => {
      setTimeout(() => {
        userInteracted = false;
      }, 2000);
    });
  }

  // Video hover/tap functionality for slider images
  const slideImages = document.querySelectorAll('.why-slide-image');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  slideImages.forEach(imageContainer => {
    const video = imageContainer.querySelector('.why-slide-video');

    if (video) {
      // Click functionality for both mobile and desktop
      imageContainer.addEventListener('click', (e) => {
        // Close other videos in the slider
        slideImages.forEach(otherContainer => {
          if (otherContainer !== imageContainer) {
            otherContainer.classList.remove('active');
            const otherVideo = otherContainer.querySelector('.why-slide-video');
            if (otherVideo) {
              otherVideo.pause();
              otherVideo.currentTime = 0;
            }
          }
        });

        // Toggle current video
        const isActive = imageContainer.classList.contains('active');
        if (isActive) {
          imageContainer.classList.remove('active');
          video.pause();
          video.currentTime = 0;
        } else {
          imageContainer.classList.add('active');
          video.currentTime = 0;
          video.play().catch(() => {});
        }

        // Pause auto-slide when interacting with video
        resetUserInteraction();
      });

      // Desktop: Also support hover
      if (!isTouchDevice) {
        imageContainer.addEventListener('mouseenter', () => {
          if (!imageContainer.classList.contains('active')) {
            imageContainer.classList.add('active');
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        });

        imageContainer.addEventListener('mouseleave', () => {
          imageContainer.classList.remove('active');
          video.pause();
          video.currentTime = 0;
        });
      }
    }
  });
});

// ==================== //
// PACKAGE BUILDER CALCULATOR & FORM
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
  const headsetSelect = document.getElementById('headset-quantity');
  const transmitterSelect = document.getElementById('transmitter-quantity');
  const estimatedTotalInput = document.getElementById('estimated-total');
  const packageForm = document.getElementById('package-form');

  // Pricing (USD)
  const HEADSET_PRICE = 49;
  const TRANSMITTER_PRICE = 169;

  // Function to update price summary
  function updatePrice() {
    const headsetQty = headsetSelect.value;
    const transmitterQty = transmitterSelect.value;

    // Check if custom is selected
    if (headsetQty === 'custom' || transmitterQty === 'custom') {
      // Show contact message
      document.getElementById('summary-headsets').textContent = '-';
      document.getElementById('summary-transmitters').textContent = '-';
      document.getElementById('price-headsets').textContent = '-';
      document.getElementById('price-transmitters').textContent = '-';
      document.getElementById('price-total').textContent = 'Custom Quote';
      estimatedTotalInput.value = 'Custom - Contact for Quote';
      return;
    }

    // Calculate prices
    const headsetTotal = parseInt(headsetQty) * HEADSET_PRICE;
    const transmitterTotal = parseInt(transmitterQty) * TRANSMITTER_PRICE;
    const grandTotal = headsetTotal + transmitterTotal;

    // Update display
    document.getElementById('summary-headsets').textContent = headsetQty;
    document.getElementById('summary-transmitters').textContent = transmitterQty;
    document.getElementById('price-headsets').textContent = `$${headsetTotal.toLocaleString()} AUD`;
    document.getElementById('price-transmitters').textContent = `$${transmitterTotal.toLocaleString()} AUD`;
    document.getElementById('price-total').textContent = `$${grandTotal.toLocaleString()} AUD`;

    // Update hidden field for form submission
    estimatedTotalInput.value = `$${grandTotal.toLocaleString()} AUD`;
  }

  // Event listeners for price updates
  if (headsetSelect && transmitterSelect) {
    headsetSelect.addEventListener('change', updatePrice);
    transmitterSelect.addEventListener('change', updatePrice);
  }

  // Form submission handler
  if (packageForm) {
    packageForm.addEventListener('submit', function(e) {
      // Let the form submit naturally to Formspree
      // Show a loading state on the button
      const submitBtn = document.getElementById('submit-quote-btn');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    });
  }
});
