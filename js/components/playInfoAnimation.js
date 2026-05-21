function playInfoAnimation() {
    const root = document.querySelector('.info__left');

    const sparkle = document.getElementById('info_sparkle');
    const pawn = document.getElementById('info_pawn_hand');
    const knight = document.getElementById('info_knight');
    const sparkleSmall = document.getElementById('info_sparkle_small');

    // стартовое состояние
    root.classList.add('info__anim-init');

    // 1. идея
    setTimeout(() => {
        sparkle.classList.add('animate-sparkle');
    }, 200);

    // 2. удар пешкой
    setTimeout(() => {
        pawn.classList.add('animate-pawn');
    }, 700);

    // 3. удар коня
    setTimeout(() => {
        knight.classList.add('animate-knight');
    }, 900);

    // 4. эффект удара
    setTimeout(() => {
        sparkleSmall.classList.add('animate-sparkle-small');
    }, 950);
}