export class Parallax {
    constructor(container, element) {
        this.container = document.querySelector(container);
        this.elements = this.container.querySelectorAll(element);
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        this.boundMove = this.onMove.bind(this)

        this.container.addEventListener(
            'mousemove',
            this.boundMove
        )

        this.animate()
    }

    onMove(e) {
        const rect = this.container.getBoundingClientRect();

        this.mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        this.mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    }

    animate() {
        this.elements.forEach((el) => {
            const depth = parseFloat(el.dataset.depth || 0);
            el.style.transform = `translate(-50%, 0) rotate(${el.dataset.rotate || 0}deg) translate3d(${this.mouseX * depth * 40}px, ${this.mouseY * depth * 40}px, 0)`;
        });

        this.frame =
            requestAnimationFrame(
                () => this.animate()
            )
    }

    destroy() {
        this.container.removeEventListener(
            'mousemove',
            this.boundMove
        )

        cancelAnimationFrame(this.frame)
    }
}