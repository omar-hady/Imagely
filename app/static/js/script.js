// Legacy accordion functionality (for backward compatibility)
const legacyAccordionToggle = document.querySelectorAll(".accordion--header");
const legacyAccordionContent = document.querySelectorAll(".accordion--content");
const legacyAccordionIcon = document.querySelectorAll(".accordion--icon i");

if (legacyAccordionContent.length > 0) {
    legacyAccordionContent.forEach(content => content.style.height = "0px");

    for (let i = 0; i < legacyAccordionToggle.length; i++) {
        legacyAccordionToggle[i].addEventListener("click", () => {
            const content = legacyAccordionContent[i];

            if (content.style.height === "0px" || content.style.height === "") {
                content.style.height = content.scrollHeight + "px";
                legacyAccordionIcon[i].classList.replace("ri-add-line", "ri-subtract-fill");
            } else {
                content.style.height = "0px";
                legacyAccordionIcon[i].classList.replace("ri-subtract-fill", "ri-add-line");
            }

            // Close all other accordions
            for (let j = 0; j < legacyAccordionContent.length; j++) {
                if (j !== i) {
                    legacyAccordionContent[j].style.height = "0px";
                    legacyAccordionIcon[j].classList.replace("ri-subtract-fill", "ri-add-line");
                }
            }
        });
    }
}

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
    typewriterSpan.textContent = currentWord.substring(0, charIndex);
  } else {
    charIndex++;
    typewriterSpan.textContent = currentWord.substring(0, charIndex);
  }

  let delay =150;
  if (!isDeleting && charIndex === currentWord.length) {
    delay = 1000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    twIndex = (twIndex + 1) % typewriterWords.length;
    delay = 1500;
  }
  setTimeout(typewriterTick, delay);
}

// Enhanced FAQ functionality for new home page
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
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

// Like button functionality
const likeButtons = document.querySelectorAll('.like-btn');

likeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('ri-heart-line')) {
            icon.classList.replace('ri-heart-line', 'ri-heart-fill');
            icon.style.color = '#e74c3c';
            button.style.background = 'rgba(231, 76, 60, 0.2)';
            
            // Add animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        } else {
            icon.classList.replace('ri-heart-fill', 'ri-heart-line');
            icon.style.color = '#fff';
            button.style.background = 'rgba(255,255,255,0.2)';
        }
    });
});

// Download button functionality
const downloadButtons = document.querySelectorAll('.download-btn');

downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = button.closest('.creation-card');
        const img = card.querySelector('img');
        
        if (img) {
            // Create download link
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `imagely_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success feedback
            showNotification('Image downloaded successfully!', 'success');
        }
    });
});

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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Animate creation cards
    const creationCards = document.querySelectorAll('.creation-card');
    creationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Start typewriter effect
    if (typewriterSpan) typewriterTick();
});

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
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

// Dynamic Latest Creations API Integration
class LatestCreationsAPI {
    constructor() {
        this.apiUrl = 'https://api.unsplash.com/photos/random';
        this.apiKey = 'YOUR_UNSPLASH_API_KEY'; // Replace with your actual API key
        this.creationsGrid = document.getElementById('creations-grid');
        this.isLoading = false;
        this.creations = [];
    }

    // Simulate API data for demo (replace with real API call)
    async fetchLatestCreations() {
        try {
            this.isLoading = true;
            this.showLoading();

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock API response data
            const mockData = [
                {
                    id: 1,
                    title: "Abstract Art Collection",
                    imageUrl: "/static/images/Explore/1.jpg",
                    author: "Sarah Johnson",
                    timestamp: "2 hours ago",
                    likes: 124,
                    downloads: 45
                },
                {
                    id: 2,
                    title: "Mountain Landscape",
                    imageUrl: "/static/images/Explore/2.jpg",
                    author: "Mike Chen",
                    timestamp: "4 hours ago",
                    likes: 89,
                    downloads: 32
                },
                {
                    id: 3,
                    title: "City Night Lights",
                    imageUrl: "/static/images/Explore/3.jpg",
                    author: "Emma Davis",
                    timestamp: "6 hours ago",
                    likes: 156,
                    downloads: 67
                },
                {
                    id: 4,
                    title: "Professional Portrait",
                    imageUrl: "/static/images/Explore/4.jpg",
                    author: "Alex Thompson",
                    timestamp: "8 hours ago",
                    likes: 203,
                    downloads: 89
                },
                {
                    id: 5,
                    title: "Culinary Masterpiece",
                    imageUrl: "/static/images/Explore/5.jpg",
                    author: "Lisa Wang",
                    timestamp: "10 hours ago",
                    likes: 167,
                    downloads: 54
                },
                {
                    id: 6,
                    title: "Modern Architecture",
                    imageUrl: "/static/images/Explore/6.jpg",
                    author: "David Kim",
                    timestamp: "12 hours ago",
                    likes: 145,
                    downloads: 78
                }
            ];

            this.creations = mockData;
            this.renderCreations();
            this.isLoading = false;

        } catch (error) {
            console.error('Error fetching latest creations:', error);
            this.showError('Failed to load latest creations');
            this.isLoading = false;
        }
    }

    // Real API call function (uncomment and configure for production)
    /*
    async fetchRealAPI() {
        try {
            const response = await fetch(`${this.apiUrl}?count=6&client_id=${this.apiKey}`);
            const data = await response.json();
            
            this.creations = data.map(item => ({
                id: item.id,
                title: item.alt_description || item.description || 'Untitled Creation',
                imageUrl: item.urls.regular,
                author: item.user.name,
                timestamp: this.formatTimestamp(item.created_at),
                likes: item.likes,
                downloads: item.downloads || 0
            }));
            
            this.renderCreations();
        } catch (error) {
            console.error('API Error:', error);
            this.showError('Failed to load latest creations');
        }
    }
    */

    showLoading() {
        this.creationsGrid.innerHTML = `
            <div class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>Loading latest creations...</p>
            </div>
        `;
    }

    showError(message) {
        this.creationsGrid.innerHTML = `
            <div class="loading-placeholder">
                <i class="ri-error-warning-line" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                <p>${message}</p>
                <button onclick="latestCreationsAPI.fetchLatestCreations()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: var(--burble); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }

    renderCreations() {
        if (!this.creations.length) {
            this.showError('No creations found');
            return;
        }

        const creationsHTML = this.creations.map(creation => `
            <div class="creation-card" data-id="${creation.id}">
                <div class="creation-image">
                    <img src="${creation.imageUrl}" alt="${creation.title}" loading="lazy">
                    <div class="creation-overlay">
                        <div class="creation-actions">
                            <button class="like-btn" data-likes="${creation.likes}">
                                <i class="ri-heart-line"></i>
                            </button>
                            <button class="download-btn">
                                <i class="ri-download-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="creation-info">
                    <h3 class="creation-title">${creation.title}</h3>
                    <div class="creation-meta">
                        <div class="creation-author">
                            <i class="ri-camera-line"></i>
                            <span>${creation.author}</span>
                        </div>
                        <span>${creation.timestamp}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.creationsGrid.innerHTML = creationsHTML;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Like button functionality
        const likeButtons = this.creationsGrid.querySelectorAll('.like-btn');
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('ri-heart-line')) {
                    icon.classList.replace('ri-heart-line', 'ri-heart-fill');
                    icon.style.color = '#e74c3c';
                    button.style.background = 'rgba(231, 76, 60, 0.2)';
                    
                    // Update likes count
                    const currentLikes = parseInt(button.dataset.likes) || 0;
                    button.dataset.likes = currentLikes + 1;
                    
                    // Add animation
                    button.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    icon.classList.replace('ri-heart-fill', 'ri-heart-line');
                    icon.style.color = '#fff';
                    button.style.background = 'rgba(255,255,255,0.2)';
                    
                    // Update likes count
                    const currentLikes = parseInt(button.dataset.likes) || 0;
                    button.dataset.likes = Math.max(0, currentLikes - 1);
                }
            });
        });

        // Download button functionality
        const downloadButtons = this.creationsGrid.querySelectorAll('.download-btn');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.creation-card');
                const img = card.querySelector('img');
                
                if (img) {
                    // Create download link
                    const link = document.createElement('a');
                    link.href = img.src;
                    link.download = `imagely_${Date.now()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Show success feedback
                    showNotification('Image downloaded successfully!', 'success');
                }
            });
        });
    }

    formatTimestamp(timestamp) {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return '1 day ago';
        return `${diffInDays} days ago`;
    }

    // Auto-refresh functionality
    startAutoRefresh(intervalMinutes = 5) {
        setInterval(() => {
            if (!this.isLoading) {
                this.fetchLatestCreations();
            }
        }, intervalMinutes * 60 * 1000);
    }
}

// Initialize Latest Creations API
const latestCreationsAPI = new LatestCreationsAPI();

// Load creations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start typewriter effect
    if (typewriterSpan) typewriterTick();
    
    // Load latest creations
    latestCreationsAPI.fetchLatestCreations();
    
    // Start auto-refresh every 5 minutes
    latestCreationsAPI.startAutoRefresh(5);
    
    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
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
            marquee.innerHTML = '<div style="color:#aaa;text-align:center;width:100%;font-size:1.6rem;">No saved photos yet.</div>';
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