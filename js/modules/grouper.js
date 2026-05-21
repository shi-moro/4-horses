export class MobileStageGrouper {
    constructor(selector, breakpoint = 768) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        this.breakpoint = breakpoint;
        this.originalHTML = this.container.innerHTML;
        this.isGrouped = false;

        this.init();
    }

    init() {
        this.checkMode();

        window.addEventListener('resize', () => {
            this.checkMode();
        });
    }

    checkMode() {
        const isMobile = window.innerWidth <= this.breakpoint;

        if (isMobile && !this.isGrouped) {
            this.group();
        }

        if (!isMobile && this.isGrouped) {
            this.ungroup();
        }
    }

    group() {
        const slides = [...this.container.children];
        const groups = {};

        slides.forEach(slide => {
            const groupId = slide.dataset.group;

            if (!groups[groupId]) {
                groups[groupId] = [];
            }

            groups[groupId].push(slide);
        });

        this.container.innerHTML = '';

        Object.values(groups).forEach(groupSlides => {
            const newSlide = document.createElement('li');
            newSlide.className = groupSlides[0].className;

            groupSlides.forEach(slide => {
                const wrappers = slide.querySelectorAll('.stages__wrapper');

                wrappers.forEach(wrapper => {
                    newSlide.appendChild(wrapper.cloneNode(true));
                });
            });

            this.container.appendChild(newSlide);
        });

        this.isGrouped = true;

        this.container.dispatchEvent(
            new CustomEvent('slidesChanged')
        );
    }

    ungroup() {
        this.container.innerHTML = this.originalHTML;
        this.isGrouped = false;

        this.container.dispatchEvent(
            new CustomEvent('slidesChanged')
        );
    }
}