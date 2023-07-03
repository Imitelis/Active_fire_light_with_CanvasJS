const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
	beforeX: undefined,
	forceX: 0
}

function getRandomInt(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

class Particle {
	constructor() {
		this.hue = getRandomInt(0, 65);

		this.reset();
	}

	reset() {
		this.x = canvas.width * 0.5;
		this.y = canvas.height * 0.5;
		this.x += getRandomInt(-10, 10);
		this.y += getRandomInt(-10, 10);
		this.radius = Math.floor((canvas.width + canvas.height) * 0.015);
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, .5)`;
		ctx.fill();
		ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 1)`;
		ctx.shadowBlur = 15;
		ctx.closePath();
	}

	update() {
		if (this.radius <= 0) {
			this.reset();
		}
		this.radius -= 1;
		this.y -= 5;
		this.x += mouse.forceX * ((30 - this.radius) / 30) * 1.5;
	}
}

class init {
  constructor() {
    	this.animate = this.animate.bind(this);
    	this.particles = [];
    	this.particleCount = 75;

	this.resize();
    	this.animate();
  }

  resize() {
    	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	this.particles.map((particle) => {
		particle.update();
	});
  }

  animate() {
	if (this.particles.length < this.particleCount) {
		this.particles.push(new Particle());
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.globalCompositeOperation = "lighter";
	
	this.particles.map((particle) => {
		particle.update();
		particle.draw();
	});

	requestAnimationFrame(this.animate);
  }
}

const animation = new init();

window.addEventListener('resize',
  function () {
    animation.resize();
  })
  
window.addEventListener('mousemove',
function(e){
    if (e.y >= canvas.height * 0.5 - 200 && e.y <= canvas.height * 0.5 + 30) {
		if (e.x >= canvas.width * 0.5 - 100 && e.x <= canvas.width * 0.5 + 100) {
			if (mouse.beforeX) {
				mouse.forceX = e.x - mouse.beforeX;
			}
			mouse.beforeX = e.x;
		} else {
			mouse.forceX = 0;
			mouse.beforeX = undefined;
		}
	} else {
		mouse.forceX = 0;
		mouse.beforeX = undefined;
	}
})

window.addEventListener('mouseout',
function(){
    mouse.beforeX = undefined;
    mouse.forceX = 0;
})
