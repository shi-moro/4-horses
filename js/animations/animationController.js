import { Parallax } from './parallax.js'
import { FloatingAnimation } from './floating.js'

export class AnimationController {

    constructor() {
        this.currentAnimation = null

        this.checkMode()

        window.addEventListener(
            'resize',
            this.debounce(() => {
                this.checkMode()
            }, 200)
        )
    }

    checkMode() {
        const isMobile =
            window.innerWidth <= 768

        const nextMode =
            isMobile ? 'floating' : 'parallax'

        if (this.mode === nextMode) return
        this.mode = nextMode

        this.currentAnimation?.destroy()

        if (isMobile) {

            this.currentAnimation =
                new FloatingAnimation(
                    '#parallax',
                    '.header__chesspiece'
                )
        } else {
            this.currentAnimation =
                new Parallax(
                    '#parallax',
                    '.header__chesspiece'
                )
        }
    }

    debounce(fn, delay) {
        let timeout

        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                fn(...args)
            }, delay)
        }
    }
}