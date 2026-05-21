export class Ticker {

    constructor(selector, options = {}) {
        this.ticker = document.querySelector(selector)
        if (!this.ticker) return

        this.track = this.ticker.querySelector('.ticker__track')
        this.items = options.items || []

        this.speed = options.speed || 20
        this.pauseOnHover = options.pauseOnHover ?? true

        this.init()
    }

    init() {
        this.renderContent()

        requestAnimationFrame(() => {
            this.cloneContent()
            this.startAnimation()

            if (this.pauseOnHover) {
                this.bindHoverEvents()
            }
        })
    }

    renderContent() {
        const content = document.createElement('div')
        content.classList.add('ticker__content')

        this.items.forEach((item, index) => {
            const text = document.createElement('span')
            text.textContent = item
            content.appendChild(text)

            if (index !== this.items.length) {
                const dot = document.createElement('span')
                dot.classList.add('ticker__dot')
                content.appendChild(dot)
            }
        })

        this.track.appendChild(content)
        this.content = content
    }

    cloneContent() {
        const clone = this.content.cloneNode(true)
        clone.setAttribute('aria-hidden', 'true')

        this.track.appendChild(clone)
    }

    startAnimation() {
        this.track.style.animation =
            `ticker ${this.speed}s linear infinite`
    }

    bindHoverEvents() {
        this.ticker.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused'
        })

        this.ticker.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running'
        })
    }
}