// Save Photos Page JavaScript
class SavePhotosManager {
    constructor() {
        this.savedPhotos = [];
        this.init();
    }

    init() {
        this.loadSavedPhotos();
        this.setupEventListeners();
    }

    // Load saved photos from localStorage
    loadSavedPhotos() {
        const saved = localStorage.getItem('imagely_saved_photos');
        this.savedPhotos = saved ? JSON.parse(saved) : [];
        this.updateUI();
    }

    // Save photos to localStorage
    saveToStorage() {
        localStorage.setItem('imagely_saved_photos', JSON.stringify(this.savedPhotos));
    }

    // Remove photo from saved
    removePhoto(photoId) {
        const index = this.savedPhotos.findIndex(p => p.id === photoId);
        if (index !== -1) {
            this.savedPhotos.splice(index, 1);
            this.saveToStorage();
            this.updateUI();
            this.showNotification('Photo removed from saved', 'info');
        }
    }

    // Update UI based on current state
    updateUI() {
        const emptyState = document.getElementById('emptyState');
        const savedGallery = document.getElementById('savedGallery');
        const loadingState = document.getElementById('loadingState');
        const saveCount = document.querySelector('.save-count');

        if (loadingState) {
            loadingState.style.display = 'none';
        }

        if (this.savedPhotos.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            if (savedGallery) savedGallery.style.display = 'none';
            if (saveCount) saveCount.textContent = '0 photos saved';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            if (savedGallery) savedGallery.style.display = 'block';
            if (saveCount) saveCount.textContent = `${this.savedPhotos.length} photo${this.savedPhotos.length !== 1 ? 's' : ''} saved`;
            
            this.renderPhotos();
        }
    }

    // Render photos in the grid
    renderPhotos() {
        const imagesContainer = document.getElementById('savedImages');
        if (!imagesContainer) return;

        if (this.savedPhotos.length === 0) {
            imagesContainer.innerHTML = `
                <div class="no-results">
                    <i class="ri-search-line"></i>
                    <h3>No saved photos</h3>
                    <p>Start exploring and save your favorites!</p>
                </div>
            `;
            return;
        }

        const html = this.savedPhotos.map(photo => `
            <div class="saved-card" data-id="${photo.id}" onclick="saveManager.showLightbox('${photo.id}')">
                <div class="card-image">
                    <img src="${photo.src.medium}" alt="${photo.title || 'Saved photo'}" loading="lazy">
                    <div class="card-overlay">
                        <div class="overlay-content">
                            <div class="photo-info">
                                <div class="photographer-info">
                                    <i class="ri-camera-line"></i>
                                    <span>${photo.photographer}</span>
                                </div>
                            </div>
                            <div class="card-actions">
                                <button class="action-btn" onclick="saveManager.removePhoto('${photo.id}'); event.stopPropagation();" title="Remove from saved">
                                    <i class="ri-heart-fill"></i>
                                </button>
                                <button class="action-btn" onclick="saveManager.downloadPhoto('${photo.src.large2x}'); event.stopPropagation();" title="Download">
                                    <i class="ri-download-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <h3 class="photo-title">${photo.title || 'Untitled'}</h3>
                    <p class="saved-date">${this.formatDate(photo.savedAt)}</p>
                </div>
            </div>
        `).join('');

        imagesContainer.innerHTML = html;
    }

    // Show lightbox
    showLightbox(photoId) {
        const photo = this.savedPhotos.find(p => p.id === photoId);
        if (!photo) return;

        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const photographer = document.getElementById('lightboxPhotographer');
        const date = document.getElementById('lightboxDate');

        if (lightboxImage) lightboxImage.src = photo.src.large2x;
        if (photographer) photographer.textContent = photo.photographer;
        if (date) date.textContent = this.formatDate(photo.savedAt);

        lightbox.dataset.photoId = photoId;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Hide lightbox
    hideLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Download photo
    async downloadPhoto(imgURL) {
        try {
            const response = await fetch(imgURL);
            if (!response.ok) throw new Error('Failed to fetch image');
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `imagely_saved_${new Date().getTime()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Photo downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Failed to download photo. Please try again.', 'error');
        }
    }

    // Share photo
    sharePhoto(platform) {
        const photoId = document.getElementById('lightbox').dataset.photoId;
        const photo = this.savedPhotos.find(p => p.id === photoId);
        if (!photo) return;

        const url = window.location.origin + '/save';
        const text = `Check out this amazing photo: ${photo.title || 'Untitled'} by ${photo.photographer}`;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'pinterest':
                window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(photo.src.large2x)}&description=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copied to clipboard!', 'success');
                });
                break;
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
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

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        
        return date.toLocaleDateString();
    }

    // Setup event listeners
    setupEventListeners() {
        // Lightbox close
        const closeLightbox = document.getElementById('closeLightbox');
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => this.hideLightbox());
        }

        // Lightbox background click
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.hideLightbox();
                }
            });
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.showShareModal());
        }

        // Share modal
        const shareModal = document.getElementById('shareModal');
        const closeShareModal = document.getElementById('closeShareModal');
        if (closeShareModal) {
            closeShareModal.addEventListener('click', () => this.hideShareModal());
        }

        // Share options
        const shareOptions = document.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.dataset.platform;
                this.sharePhoto(platform);
                this.hideShareModal();
            });
        });

        // Modal background clicks
        if (shareModal) {
            shareModal.addEventListener('click', (e) => {
                if (e.target === shareModal) {
                    this.hideShareModal();
                }
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLightbox();
                this.hideShareModal();
            }
        });
    }

    // Show share modal
    showShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Hide share modal
    hideShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// Initialize the save photos manager
const saveManager = new SavePhotosManager();

// Make it globally available for onclick handlers
window.saveManager = saveManager; 