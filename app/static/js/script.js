

// Typewriter effect for home headline
const typewriterWords = [
    'Explore Stunning Ideas...',
    'Generate Unique Art...',
    'Save Your Favorite Styles...',
    'Design. Iterate. Inspire...',
    'Turn Prompts into Masterpieces...',
    'Bring Concepts to Life...',
  ];
  
let twIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterSpan = document.querySelector('.typewriter');

function typewriterTick() {
  if (!typewriterSpan) return;
  const currentWord = typewriterWords[twIndex];
  
  if (isDeleting) {
    charIndex--;
    // استخدم مسافة غير مرئية للحفاظ على المساحة
    const visibleText = currentWord.substring(0, charIndex);
    const invisibleSpaces = '&nbsp;'.repeat(Math.max(0, currentWord.length - charIndex));
    typewriterSpan.innerHTML = visibleText + invisibleSpaces;
  } else {
    charIndex++;
    const visibleText = currentWord.substring(0, charIndex);
    const invisibleSpaces = '&nbsp;'.repeat(Math.max(0, currentWord.length - charIndex));
    typewriterSpan.innerHTML = visibleText + invisibleSpaces;
  }

  let delay = 60; // أسرع
  if (!isDeleting && charIndex === currentWord.length) {
    delay = 600; // توقف أقصر بعد نهاية الكلمة
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    twIndex = (twIndex + 1) % typewriterWords.length;
    delay = 800; // توقف أقصر بعد المسح
  }
  setTimeout(typewriterTick, delay);
}





// Show notification function
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};





// Enhanced FAQ functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Show success message
        const button = newsletterForm.querySelector('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="ri-check-line"></i> Subscribed!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            newsletterForm.reset();
        }, 3000);
        
        showNotification('Successfully subscribed to newsletter!', 'success');
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start typewriter effect
    if (typewriterSpan) {
        // تهيئة النص الأولي
        const firstWord = typewriterWords[0];
        typewriterSpan.innerHTML = '&nbsp;'.repeat(firstWord.length);
        typewriterTick();
    }
});



// Latest Saved Marquee (Home Page)
document.addEventListener('DOMContentLoaded', function() {
    const marquee = document.querySelector('.latest-saved-marquee');
    if (marquee) {
        let savedPhotos = [];
        try {
            savedPhotos = JSON.parse(localStorage.getItem('imagely_saved_photos')) || [];
        } catch (e) { savedPhotos = []; }
        if (savedPhotos.length === 0) {
            marquee.innerHTML = '<div class="no-saved-message">No saved photos yet.</div>';
            return;
        }
        // كرر الصور حتى تملأ الشريط (على الأقل مرتين)
        let images = savedPhotos.map(photo => `<img src="${photo.src.medium}" alt="Saved" loading="lazy">`).join('');
        while (savedPhotos.length < 8) {
            images += images; // كرر الصور إذا كانت قليلة
            if (images.split('<img').length > 20) break;
        }
        // ضع الصور مرتين لعمل loop لا نهائي
        marquee.innerHTML = `<div class="latest-saved-marquee-track">${images}${images}</div>`;
    }
});

// Sticky navbar hide/show on scroll (يعمل في كل الصفحات)
(function() {
    const navbar = document.querySelector('.explore-navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentY = window.scrollY;
                if (currentY > lastScrollY && currentY > 60) {
                    // Scroll down: hide navbar
                    navbar.classList.add('hide');
                } else if (currentY < lastScrollY - 5) {
                    // Scroll up: show navbar
                    navbar.classList.remove('hide');
                }
                lastScrollY = currentY;
                ticking = false;
            });
            ticking = true;
        }
    });
})();

document.addEventListener('DOMContentLoaded', function() {
  const bottomNav = document.querySelector('.bottom-nav');
  if (!bottomNav) return;
  let lastScrollY = window.scrollY;
  let ticking = false;
  function handleScroll() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 40) {
      // Scroll down: hide
      bottomNav.style.transform = 'translateY(100%)';
      bottomNav.style.opacity = '0';
      bottomNav.style.pointerEvents = 'none';
    } else if (currentY < lastScrollY - 5) {
      // Scroll up: show
      bottomNav.style.transform = 'translateY(0)';
      bottomNav.style.opacity = '1';
      bottomNav.style.pointerEvents = 'auto';
    }
    lastScrollY = currentY;
    ticking = false;
  }
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });
  // Initial state
  bottomNav.style.transition = 'transform 0.3s, opacity 0.3s';
});
