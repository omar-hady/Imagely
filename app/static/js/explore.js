// DOM Elements
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector("#exploreSearchInput");
const exploreNavbar = document.getElementById('exploreNavbar');
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox?.querySelector(".ri-close-line");
const downloadImgBtn = lightBox?.querySelector(".ri-download-line");

// API Configuration
const apiKey = "HYPqRQ1DVW0lSNo1qlGGm7FchoCId4CnU4qcs61XgeVcCxomomWhJRLs";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;
let isLoading = false;
let lastLoadedImages = [];

// Check if required elements exist
if (!imagesWrapper || !loadMoreBtn || !searchInput) {
    console.error("Required DOM elements not found!");
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
}

// Download image function
const downloadImg = async (imgURL) => {
    try {
        const response = await fetch(imgURL);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `imagely_${new Date().getTime()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Image downloaded successfully!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Failed to download image. Please try again.', 'error');
    }
}

// Show lightbox
const showLightbox = (name, img) => {
    if (!lightBox) return;
    
    const lightboxImg = lightBox.querySelector("img");
    const photographerSpan = lightBox.querySelector("span");
    
    if (lightboxImg) lightboxImg.src = img;
    if (photographerSpan) photographerSpan.innerText = name;
    if (downloadImgBtn) downloadImgBtn.setAttribute("data-img", img);
    
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

// Hide lightbox
const hideLightbox = () => {
    if (!lightBox) return;
    
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

// Sticky navbar hide/show on scroll
let lastScrollY = window.scrollY;
let ticking = false;
window.addEventListener('scroll', () => {
    if (!exploreNavbar) return;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY && currentY > 60) {
                // Scroll down: hide navbar
                exploreNavbar.classList.add('hide');
            } else if (currentY < lastScrollY - 5) {
                // Scroll up: show navbar (حتى لو طلع قليل)
                exploreNavbar.classList.remove('hide');
            }
            lastScrollY = currentY;
            ticking = false;
        });
        ticking = true;
    }
});

// Generate HTML for images
const generateHTML = (images) => {
    if (!imagesWrapper || !images || images.length === 0) return;
    
    const loadingPlaceholder = imagesWrapper.querySelector('.loading-placeholder');
    if (loadingPlaceholder) {
        loadingPlaceholder.remove();
    }
    
    if (currentPage === 1) {
        lastLoadedImages = images;
    } else {
        lastLoadedImages = lastLoadedImages.concat(images);
    }
    
    renderImages();
}

// Render images
function renderImages() {
    if (!imagesWrapper) return;
    imagesWrapper.innerHTML = '';
    const html = lastLoadedImages.map(img => {
        const isSaved = isPhotoSaved(img.id);
        return `
            <div class="imagely-card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
                <div class="card-image">
                    <img src="${img.src.medium}" alt="${img.alt || 'Image'}" loading="lazy">
                    <div class="card-overlay">
                        <div class="overlay-content">
                            <div class="photographer-info">
                                <i class="ri-camera-line"></i>
                                <span>${img.photographer}</span>
                            </div>
                            <div class="card-actions">
                                <button class="save-btn ${isSaved ? 'saved' : ''}" data-photo-id="${img.id}" title='${isSaved ? "Remove from saved" : "Save photo"}'>
                                    <i class="ri-heart-${isSaved ? 'fill' : 'line'}"></i>
                                </button>
                                <button class="download-btn" onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
                                    <i class="ri-download-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    imagesWrapper.innerHTML = html;
    imagesWrapper.style.opacity = '1';

    // بعد عرض الصور، اجعل كل صورة تظهر عند التحميل
    const imgs = imagesWrapper.querySelectorAll('img');
    imgs.forEach(img => {
        img.onload = () => {
            img.style.opacity = '1';
        };
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // حل مشكلة زر الحفظ: استخدم data-photo-id وevent delegation
    const saveBtns = imagesWrapper.querySelectorAll('.save-btn');
    saveBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const photoId = btn.getAttribute('data-photo-id');
            const photo = lastLoadedImages.find(img => img.id == photoId);
            if (photo) toggleSavePhoto(photo);
        };
    });
}

// Save photo function
function toggleSavePhoto(photo) {
    const savedPhotos = JSON.parse(localStorage.getItem('imagely_saved_photos') || '[]');
    const existingIndex = savedPhotos.findIndex(p => p.id === photo.id);

    const cleanPhoto = {
        id: photo.id,
        src: {
            medium: photo.src && photo.src.medium ? photo.src.medium : 'https://via.placeholder.com/300x200?text=No+Image',
            large2x: photo.src && photo.src.large2x ? photo.src.large2x : 'https://via.placeholder.com/600x400?text=No+Image'
        },
        photographer: photo.photographer || 'Unknown',
        alt: photo.alt || '',
        title: photo.title || photo.alt || 'Untitled',
        savedAt: new Date().toISOString()
    };

    if (existingIndex === -1) {
        savedPhotos.unshift(cleanPhoto);
        localStorage.setItem('imagely_saved_photos', JSON.stringify(savedPhotos));
        showNotification('Photo saved successfully!', 'success');
    } else {
        savedPhotos.splice(existingIndex, 1);
        localStorage.setItem('imagely_saved_photos', JSON.stringify(savedPhotos));
        showNotification('Photo removed from saved', 'info');
    }
    renderImages();
}

// Check if photo is saved
function isPhotoSaved(photoId) {
    const savedPhotos = JSON.parse(localStorage.getItem('imagely_saved_photos') || '[]');
    return savedPhotos.some(p => p.id === photoId);
}

// Helper: احصل على رقم صفحة عشوائي (من 1 إلى 20 فقط لتقليل الصفحات الفارغة)
function getRandomPage() {
    return Math.floor(Math.random() * 20) + 1;
}

// جلب الصور مع إعادة المحاولة تلقائياً إذا لم يجد صور (حد أقصى 10 محاولات)
const getImages = async (apiURL, tryCount = 0) => {
    if (!loadMoreBtn || isLoading) return;
    isLoading = true;
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.innerHTML = '<i class="ri-loader-4-line"></i> Loading...';
    loadMoreBtn.classList.add("disabled");

    try {
        const response = await fetch(apiURL, {
            headers: { Authorization: apiKey }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.photos || data.photos.length === 0) {
            if (tryCount < 10) {
                // جرب صفحة عشوائية أخرى
                const randomPage = getRandomPage();
                await getImages(`https://api.pexels.com/v1/curated?page=${randomPage}&per_page=${perPage}`, tryCount + 1);
                return;
            } else {
                // بعد 10 محاولات، أظهر رسالة خطأ
                if (imagesWrapper) {
                    imagesWrapper.innerHTML = `
                        <div class="loading-placeholder" style="break-inside: avoid; margin-bottom: 2rem;">
                            <i class="ri-error-warning-line" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                            <p>Sorry, couldn't load images. Please try again later.</p>
                        </div>
                    `;
                }
                return;
            }
        }
        generateHTML(data.photos);
    } catch (err) {
        console.error('Error fetching images:', err);
        showNotification('Failed to load images. Please try again.', 'error');
        if (currentPage === 1 && imagesWrapper) {
            imagesWrapper.innerHTML = `
                <div class="loading-placeholder" style="break-inside: avoid; margin-bottom: 2rem;">
                    <i class="ri-error-warning-line" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                    <p>${err.message || 'Failed to load images'}</p>
                    <button onclick="initExplore()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: var(--burble); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            `;
        }
    } finally {
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.classList.remove("disabled");
        isLoading = false;
    }
}

// Load more images
const loadMoreImages = () => {
    if (isLoading) return;
    
    currentPage++;
    const apiURL = searchTerm
        ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
        : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
}

// Search functionality
let searchTimeout;
const loadSearchImages = (e) => {
    if (!imagesWrapper) return;
    
    clearTimeout(searchTimeout);
    
    if (e.target.value.trim() === "") {
        currentPage = 1;
        searchTerm = null;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
        return;
    }

    if (e.key === "Enter") {
        performSearch(e.target.value.trim());
    } else {
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value.trim());
        }, 500);
    }
}

const performSearch = (query) => {
    if (!imagesWrapper || !query.trim()) return;
    
    currentPage = 1;
    searchTerm = query.trim();
    imagesWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
}

// Event handlers
const handleLightboxBackgroundClick = (e) => {
    if (e.target === lightBox) {
        hideLightbox();
    }
}

const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && lightBox?.classList.contains('show')) {
        hideLightbox();
    }
}

// Initialize the page
const initExplore = () => {
    if (imagesWrapper) {
        imagesWrapper.innerHTML = `
            <div class="loading-placeholder" style="break-inside: avoid; margin-bottom: 2rem;">
                <div class="loading-spinner"></div>
                <p>Loading images...</p>
            </div>
        `;
    }
    // كل مرة تفتح الصفحة، استخدم صفحة عشوائية
    currentPage = getRandomPage();
    getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreImages);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', loadSearchImages);
        searchInput.addEventListener('input', loadSearchImages);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideLightbox);
    }
    
    if (downloadImgBtn) {
        downloadImgBtn.addEventListener('click', (e) => {
            const imgUrl = e.target.getAttribute('data-img');
            if (imgUrl) {
                downloadImg(imgUrl);
            }
        });
    }
    
    if (lightBox) {
        lightBox.addEventListener('click', handleLightboxBackgroundClick);
    }
    
    document.addEventListener('keydown', handleEscapeKey);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initExplore);
