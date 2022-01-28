const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Slider
var slidermouse = document.getElementById("myRange");
var sliderpart = document.getElementById("particleRange");
var output = document.getElementById("demo");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slidermouse.oninput = function() {
  mouse.radius  = slidermouse.value;
}
particleRange.oninput = function(){
    init();
}


let particlesArray;
//get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('mousemove', 
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);
// create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.isRainbow = true;
        this.isAscending = true;
    }
    rainbow(){
        if(this.isAscending){
            if(this.color.r < 255){
                this.color.r++;
            }
            else if(this.color.g < 255){
                this.color.g++;
            }
            else if(this.color.b < 255){
                this.color.b++;
            }
            else{
                this.isAscending = false;
            }
        }
        else{
            if(this.color.b >= 0){
                this.color.b--;
            }
            else if(this.color.g >= 0){
                this.color.g--;
            }
            else if(this.color.r >= 0){
                this.color.r--;
            }
            else{
                this.isAscending = true;
            }
        }
    }
    
    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        if(this.isRainbow){
            this.rainbow();
        }
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fill();
    }

    // check particle position, check mouse position, move the particle, draw the particle
    update(){
        //check if particle is still within canvas
        if(this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //check: collision - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.directionX = -this.directionX;
                this.x += mouse.radius + this.size - distance;
            }
            if(mouse.x > this.x && this.x > this.size * 10) {
                this.directionX = -this.directionX;
                this.x -= mouse.radius + this.size - distance;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.directionY = -this.directionY;
                this.y += mouse.radius + this.size - distance;
            }
            if(mouse.y > this.y && this.y > this.size * 10) {
                this.directionY = -this.directionY;
                this.y -= mouse.radius + this.size - distance;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

//create particle array
function init() {
    particlesArray = [];
    let numberofParticles = (canvas.height * canvas.width) / 9000 * sliderpart.value;
    for (let i = 0; i < numberofParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = {r:0, g:0, b:0};

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        mouse.radius = slidermouse.value;
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
}

init();
animate();