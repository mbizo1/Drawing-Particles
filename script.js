// JavaScript source code
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// handle mouse movements
const mouse = {
    x: null,
    y: null,
    radius: 250

}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;

    //console.log(mouse.x, mouse.y);
});

//drawing text on canvas
ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('Ai', 0, 30);
const textContent = ctx.getImageData(0, 0, 100, 100);

//class that will be moving particles around the canvas
class Particle {
    constructor(x, y) {
        this.x = x + 100;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 50) + 1;

    }

    //method drawing a circle on canvas
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        //calculating distance between two points
        let dx = mouse.x - this.x;  //x-axis
        let dy = mouse.y - this.y; //y-axis
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            //makes the particles move torwards the mouse
            //this.x += directionX;
            //this.y += directionY;
            this.x -= directionX; //moves away
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX)
            {
                let dx = this.x - this.baseX;
                this.x -= dx / 5;
            }
            if(this.y !== this.baseY)
            {
                let dy = this.y - this.baseY;
                this.y -= dy / 5;
            }
        }
    }
}
console.log(textContent);
function init() {
    particleArray = [];
    //randomly drawing particle objects on the canvas
    for (let i = 0, i2 = textContent.height; i < i2; i++) {
        for(let x = 0, x2 = textContent.width; x < x2; x++)
        {
            if(textContent.data[(i * 4 * textContent.width) + (x * 4) + 3] > 128)
            {
                let positionX = x;
                let positionY = i;
                particleArray.push(new Particle(positionX * 20, positionY * 20));
            }
        }
    }
}

init();
console.log(particleArray);

//this function handles animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

//this function cycle thru the array of particle that make up the letter & measure distance
function connect()
{
    let opacityValue = 1;
    for(let a = 0; a < particleArray.length; a++)
    {
        for(let b = a; b < particleArray.length; b++)
        {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            opacityValue = 0.5;
            ctx.strokeStyle = 'rgba(255,2551,255,' + opacityValue + ')';

            if(distance < 50)
            {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}