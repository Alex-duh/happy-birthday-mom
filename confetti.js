const confettiCanvas = document.createElement('canvas');
confettiCanvas.id = 'confetti';
confettiCanvas.style.position = 'fixed';
confettiCanvas.style.top = '0';
confettiCanvas.style.left = '0';
confettiCanvas.style.pointerEvents = 'none';
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
document.body.appendChild(confettiCanvas);

const confettiCtx = confettiCanvas.getContext('2d'); // <-- changed variable name
const confettiColors = ['#d7263d', '#ffe4e1', '#fff', '#ffb6b9', '#f7cac9'];
const confettiPieces = Array.from({length: 80}, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height,
    r: Math.random() * 6 + 4,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    speed: Math.random() * 2 + 1
}));

function drawConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); // <-- use new name
    confettiPieces.forEach(p => {
        confettiCtx.beginPath();
        confettiCtx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fill();
        p.y += p.speed;
        if (p.y > confettiCanvas.height) p.y = -10;
    });
    requestAnimationFrame(drawConfetti);
    confettiCanvas.style.zIndex = '1'; // Add this line
// ...existing code...
}
drawConfetti();