const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let hearts = [];
let score = 0;
let gameActive = false;
let timer = 20;
let intervalId;

// Slider (paddle) properties
const slider = document.getElementById('slider');
let sliderX = 170; // initial left position
const sliderWidth = 60;
const sliderHeight = 20;
const sliderY = canvas.height - 50;

// Move slider with mouse/touch
function setSliderPosition(x) {
    sliderX = Math.max(0, Math.min(canvas.width - sliderWidth, x));
    slider.style.left = sliderX + 'px';
}
slider.onmousedown = function(e) {
    document.onmousemove = function(ev) {
        const rect = canvas.getBoundingClientRect();
        setSliderPosition(ev.clientX - rect.left - sliderWidth / 2);
    };
    document.onmouseup = function() {
        document.onmousemove = null;
    };
};
slider.ontouchstart = function(e) {
    document.ontouchmove = function(ev) {
        const rect = canvas.getBoundingClientRect();
        setSliderPosition(ev.touches[0].clientX - rect.left - sliderWidth / 2);
    };
    document.ontouchend = function() {
        document.ontouchmove = null;
    };
};

// Draw heart
function drawHeart(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size / 1.2, x, y + size);
    ctx.bezierCurveTo(x, y + size / 1.2, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.closePath();
    ctx.fillStyle = "#d7263d";
    ctx.fill();
    ctx.restore();
}

// Spawn hearts slower
function spawnHeart() {
    const x = Math.random() * (canvas.width - 40) + 20;
    hearts.push({ x, y: -30, size: 30, caught: false });
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        if (!heart.caught) drawHeart(heart.x, heart.y, heart.size);
    });
    // Draw slider on canvas for collision
    ctx.fillStyle = "#d7263d";
    ctx.fillStyle = "#d7263d";
    ctx.font = "20px Calibri";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Time: ${timer}`, canvas.width - 100, 30);
}
function startGame() {
    hearts = [];
    score = 0;
    timer = 20;
    frameCount = 0;
    gameActive = true;
    document.getElementById('message').textContent = '';
    setSliderPosition((canvas.width - sliderWidth) / 2);
    slider.innerHTML = '<img src="images/IMG_2264.png" style="width:100%;height:100%;border-radius:20px;user-select:none;" draggable="false">';
    intervalId = setInterval(() => {
        timer--;
        if (timer <= 0) clearInterval(intervalId);
    }, 1000);
    gameLoop();
}
// Update hearts
function update() {
    hearts.forEach(heart => {
        if (!heart.caught) heart.y += 2; // slower speed
        // Check collision with slider image (sliderX, sliderY, sliderWidth, sliderHeight)
        if (
            !heart.caught &&
            heart.y + heart.size > sliderY &&
            heart.y < sliderY + sliderHeight &&
            heart.x > sliderX &&
            heart.x < sliderX + sliderWidth
        ) {
            heart.caught = true;
            score++;
        }
    });
    hearts = hearts.filter(heart => heart.y < canvas.height + 30 && !heart.caught);
}

// Only spawn a heart every ~20 frames
let frameCount = 0;
function gameLoop() {
    if (!gameActive) return;
    update();
    draw();
    frameCount++;
    if (frameCount % 40 === 0) spawnHeart(); // <-- less frequent
    if (timer <= 0) endGame();
    else requestAnimationFrame(gameLoop);
}



function endGame() {
    gameActive = false;
    clearInterval(intervalId);
    draw();
    let result = score >= 10 ? 'win' : 'lose';
    window.location.href = `result.html?result=${result}&score=${score}`;
}

document.getElementById('startBtn').onclick = startGame;