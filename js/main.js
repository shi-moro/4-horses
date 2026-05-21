import { AnchorLinks } from './modules/anchorLinks.js';
import { Ticker } from './components/ticker.js';
import { Slider } from './components/slider.js';
import { MobileStageGrouper } from './modules/grouper.js';
import { InfoTextSplitter } from './modules/textSplitter.js';
import { AnimationController } from './animations/animationController.js'
import { playInfoAnimation } from './animations/playInfoAnimation.js';



/* АНИМАЦИЯ ШАПКИ */

new AnimationController()


/* БЕГУЩАЯ СТРОКА */

const tickerItems = [
    'Дело помощи утопающим — дело рук самих утопающих!',
    'Шахматы двигают вперед не только культуру, но и экономику!',
    'Лед тронулся, господа присяжные заседатели!'
]

// В шапке
new Ticker('.ticker--header', {
    items: tickerItems,
    speed: 20,
    pauseOnHover: true
})

// В подвале
new Ticker('.ticker--footer', {
    items: tickerItems,
    speed: 20,
    pauseOnHover: true
})


/* СЛАЙДЕР */

// Слайдер участников
new Slider('.participants__slider', {
    loop: true,
    autoplay: true,
    delay: 4000
})

// Слайдер этапов
new Slider('.stages__slider', {
    mobileOnly: true,
    loop: false,
    autoplay: false
})


/* ГРУППИРОВКА ЭТАПОВ */

new MobileStageGrouper('.stages__list');


document.addEventListener('DOMContentLoaded', () => {
    // Ссылки
    new AnchorLinks();

    // Сплит текста
    new InfoTextSplitter();


    /* АНИМАЦИЯ ШАХМАТИСТА */

    const infoBlock = document.querySelector('.info__left');
    if (!infoBlock) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playInfoAnimation(infoBlock);
                obs.unobserve(infoBlock);
            }
        });
    }, {
        threshold: 0.7
    });

    observer.observe(infoBlock);
});