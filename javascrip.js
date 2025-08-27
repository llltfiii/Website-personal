class ImageSlider {
    constructor() {
        this.slider = document.getElementById('slider');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.sliderDots = document.getElementById('sliderDots');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.loader = document.querySelector('.loader');
        
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Set total slides counter
        this.totalSlidesEl.textContent = this.totalSlides;
        
        // Create dots
        this.createDots();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile
        this.slider.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.slider.addEventListener('touchmove', this.handleTouchMove.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Auto-play
        this.startAutoPlay();
        
        // Pause auto-play when hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Preload images
        this.preloadImages();
    }
    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.sliderDots.appendChild(dot);
        }
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    updateCounter() {
        this.currentSlideEl.textContent = this.currentSlide + 1;
    }
    
    updateSlider() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.slider.classList.add('loading');
        
        // Show loader for a brief moment to simulate loading
        setTimeout(() => {
            this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            
            // Update active class for slides
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.currentSlide);
            });
            
            this.updateDots();
            this.updateCounter();
            this.updateButtonStates();
            
            setTimeout(() => {
                this.slider.classList.remove('loading');
                this.isAnimating = false;
            }, 300);
        }, 200);
    }
    
    updateButtonStates() {
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlider();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlider();
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlider();
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.goToSlide(0);
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Touch events for mobile swipe
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isScrolling = undefined;
    }
    
    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const diffX = this.touchStartX - touchEndX;
        const diffY = this.touchStartY - touchEndY;
        
        if (this.isScrolling === undefined) {
            this.isScrolling = Math.abs(diffX) < Math.abs(diffY);
        }
        
        if (this.isScrolling) return;
        
        e.preventDefault();
        
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.touchStartX = null;
            this.touchStartY = null;
        }
    }
    
    handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.stopAutoPlay();
                break;
        }
    }
    
    preloadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    console.log('Image loaded:', img.alt);
                });
                img.addEventListener('error', () => {
                    console.error('Error loading image:', img.alt);
                });
            }
        });
    }
}