export class Slider {
    constructor(selector, options = {}) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;

        this.track = this.slider.querySelector('.slider__track');
        this.slides = [...this.slider.querySelectorAll('.slider__slide')];
        
        this.prevButton = this.slider.querySelector('.slider__button--prev');
        this.nextButton = this.slider.querySelector('.slider__button--next');
        
        this.paginationCurrent = this.slider.querySelector('.pages__current');
        this.paginationTotal = this.slider.querySelector('.pages__all');

        this.dotsContainer = this.slider.querySelector('.slider__dots');
        this.dots = [];

        this.currentIndex = 0;
        this.itemsPerView = 1;
        self.slideWidth = 0;
        this.totalSlides = this.slides.length;
        
        this.loop = options.loop ?? false;
        this.autoplay = options.autoplay ?? false;
        this.delay = options.delay ?? 4000;
        this.mobileOnly = options.mobileOnly ?? false;
        this.breakpoint = options.breakpoint ?? 768;

        this.timer = null;
        this.isPlaying = false;

        this.eventsBound = false;
        
        this.init();
    }
    
    init() {
        this.checkMode();

        this.initPagination();

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        this.track.addEventListener('slidesChanged', () => {
            this.refresh();
        });

        if (this.autoplay) {
            this.setupAutoplayVisibility();
        }
    }

    initPagination() {
        if (this.dotsContainer) {
            this.generateDots();
        }

        this.updatePagination();
    }

    generateDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        this.dots = [];

        const pagesCount = this.totalSlides;

        for (let i = 0; i < pagesCount; i++) {
            const dot = document.createElement('button');

            dot.className = 'slider__dot';

            dot.addEventListener('click', () => {
                this.goTo(i * this.itemsPerView);
            });

            this.dotsContainer.appendChild(dot);

            this.dots.push(dot);
        }
    }

    refresh() {
        this.slides = [...this.slider.querySelectorAll('.slider__slide')];

        this.totalSlides = this.slides.length;

        this.generateDots();

        if (this.currentIndex >= this.totalSlides) {
            this.currentIndex = 0;
        }

        this.recalculateDimensions();

        this.update();
    }

    handleResize() {
        this.checkMode();
        
        if (this.isActive) {
            this.recalculateDimensions();
            this.update(); // Обновляем позицию без анимации при ресайзе
        }
    }

    checkMode() {
        const isMobile = window.innerWidth <= this.breakpoint;
        
        if (this.mobileOnly && !isMobile) {
            this.destroy();
            return;
        }
        
        this.enable();
    }

    enable() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        this.recalculateDimensions();
        
        this.bindEvents();
        
        this.updatePagination();
        
        if (this.autoplay && !this.timer) {
            this.startAutoplay();
        }
        
        this.update();
    }

    recalculateDimensions() {
        if (this.slides.length === 0) return;
        
        const containerWidth = this.slider.clientWidth;
        
        const slideElement = this.slides[0];
        const slideRect = slideElement.getBoundingClientRect();
        
        const computedStyle = window.getComputedStyle(this.track);
        const gap = parseFloat(computedStyle.gap) || 20; // По умолчанию 20px
        
        this.slideWidth = slideRect.width + gap;
        
        this.itemsPerView = Math.floor(containerWidth / slideRect.width);
        
        if (this.itemsPerView < 1) this.itemsPerView = 1;
        
        this.maxIndex = Math.max(0, this.totalSlides - this.itemsPerView);
        
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        
        this.updatePagination();
    }

    bindEvents() {
        if (this.eventsBound) return;
        
        if (this.prevButton) {
            this.prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.prev();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.next();
            });
        }
        
        this.eventsBound = true;
    }

    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex = Math.min(
                this.currentIndex + this.itemsPerView,
                this.maxIndex
            );
            this.update();
            this.resetAutoplay();
        } 
        else if (this.loop && this.maxIndex > 0) {
            this.currentIndex = 0;
            this.update();
            this.resetAutoplay();
        }
        else {
            this.nextButton.disabled = true;
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex = Math.max(
                this.currentIndex - this.itemsPerView,
                0
            );
            this.update();
            this.resetAutoplay();
        }
        else if (this.loop && this.maxIndex > 0) {
            this.currentIndex = this.maxIndex;
            this.update();
            this.resetAutoplay();
        }
        else {
            this.prevButton.disabled = true;
        }
    }

    goTo(index) {
        if (index < 0) index = 0;
        if (index > this.maxIndex) index = this.maxIndex;
        
        this.currentIndex = index;
        this.update();
        this.resetAutoplay();
    }

    update() {
        if (!this.track) return;
        
        const offset = this.currentIndex * this.slideWidth;
        
        this.track.style.transform = `translateX(-${offset}px)`;
        
        this.updatePagination();

        this.updateButtons();
        
        this.slider.dispatchEvent(new CustomEvent('slideChanged', {
            detail: { currentIndex: this.currentIndex }
        }));
    }

    updatePagination() {
        this.updateTextPagination();
        this.updateDotsPagination();
    }

    updateTextPagination() {
        if (!this.paginationCurrent && !this.paginationTotal) return;
        
        const currentPage = this.currentIndex + this.itemsPerView;
        
        if (this.paginationCurrent) {
            this.paginationCurrent.textContent = currentPage;
        }
        
        if (this.paginationTotal) {
            this.paginationTotal.textContent = ` / ${this.totalSlides}`;
        }
    }

    updateDotsPagination() {
        if (!this.dots.length) return;

        const activeIndex = this.currentIndex;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle(
                'slider__dot--active',
                index === activeIndex
            );
        });
    }

    updateButtons() {
        this.prevButton.disabled = this.currentIndex <= 0 && !this.loop ? true : false;
        this.nextButton.disabled = this.currentIndex >= this.maxIndex && !this.loop ? true : false;
    }

    startAutoplay() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (this.loop) {
                this.next();
            } 
            else if (this.currentIndex < this.maxIndex) {
                this.next();
            }
            else {
                this.stopAutoplay();
            }
        }, this.delay);
        
        this.isPlaying = true;
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isPlaying = false;
    }

    resetAutoplay() {
        if (this.autoplay && this.isPlaying) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    setupAutoplayVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.timer) clearInterval(this.timer);
            } else {
                if (this.autoplay && this.isActive) this.startAutoplay();
            }
        });
    }

    destroy() {
        this.isActive = false;
        
        if (this.track) {
            this.track.style.transform = 'none';
        }
        
        this.stopAutoplay();
        
        this.currentIndex = 0;
        this.itemsPerView = 1;
        this.maxIndex = 0;
    }
}