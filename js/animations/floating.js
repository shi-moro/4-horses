export class FloatingAnimation {

    constructor(container, element) {
        this.container =
            document.querySelector(container)
        if (!this.container) return

        this.elements =
            this.container.querySelectorAll(element)
        this.animations = []

        this.init()
    }

    init() {
        this.elements.forEach((el) => {
            const animation = el.animate(
                [
                    {
                        transform:
                            `translateY(0px)`
                    },
                    {
                        transform:
                            `translateY(-10px)`
                    },
                    {
                        transform:
                            `translateY(0px)`
                    }
                ],
                {
                    duration: 6000,

                    direction: 'alternate',

                    iterations: Infinity,

                    easing: 'ease'
                }
            )

            this.animations.push(animation)
        })
    }

    destroy() {
        this.animations.forEach(animation => {
            animation.cancel()
        })
        this.animations = []
    }
}