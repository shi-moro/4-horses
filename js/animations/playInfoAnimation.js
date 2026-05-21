export function playInfoAnimation(root) {
    const sparkle = root.querySelector('#info_sparkle');
    const pawn = root.querySelector('#info_pawn_hand');
    const knight = root.querySelector('#info_knight');
    const sparkleSmall = root.querySelector('#info_sparkle_small');

    setTimeout(() => {
        sparkle.classList.add('animate-sparkle');
    }, 200);

    setTimeout(() => {
        pawn.classList.add('animate-pawn');
    }, 1700);

    setTimeout(() => {
        knight.classList.add('animate-knight');
    }, 2000);

    setTimeout(() => {
        sparkleSmall.classList.add('animate-sparkle-small');
    }, 2050);
}