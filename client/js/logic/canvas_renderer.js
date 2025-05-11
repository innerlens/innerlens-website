export class CanvasAnimator {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.running = false;
		this.lastTime = null;
		this.animate = this.animate.bind(this);
		this.particles = [];

		this.resizeCanvasToDisplaySize();

		window.addEventListener("resize", () => {
			this.resizeCanvasToDisplaySize();
		});
	}

	start() {
		if (!this.running) {
			this.running = true;
			this.lastTime = performance.now();
			this.animate(this.lastTime);
		}
	}

	stop() {
		this.running = false;
	}

	animate(currentTime) {
		if (!this.running) return;

		const dt = (currentTime - this.lastTime) / 1000;
		this.lastTime = currentTime;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const p of this.particles) {
			p.update(dt);
			p.draw(this.ctx);
		}

		requestAnimationFrame(this.animate);
	}

	addParticle(position, velocity, acceleration, radius, style) {
		this.particles.push(
			new Particle(position, velocity, acceleration, radius, style)
		);
	}

	resizeCanvasToDisplaySize() {
		const rect = this.canvas.getBoundingClientRect();
		const scale = window.devicePixelRatio || 1;

		const width = rect.width * scale;
		const height = rect.height * scale;

		if (this.canvas.width !== width || this.canvas.height !== height) {
			this.canvas.width = width;
			this.canvas.height = height;

			this.ctx.max_x = width;
			this.ctx.max_y = height;

			this.ctx.scale = Math.min(width, height);

			document.getElementById("background-canvas").style.filter = `blur(${
				this.ctx.scale / (10.8 * scale)
			}px)`;

			document.querySelector("header").style.backdropFilter = `blur(${
				this.ctx.scale / (54 * scale)
			}px)`;
		}
	}
}

class Particle {
	constructor(position, velocity, acceleration, radius, style) {
		this.position = position;
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.radius = radius;
		this.style = style;
		this.frictionCoeff = 3;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(
			this.position.x * ctx.max_x,
			this.position.y * ctx.max_y,
			this.radius * ctx.scale,
			0,
			Math.PI * 2
		);
		ctx.fillStyle = this.style.color;
		ctx.fill();
	}

	update(dt) {
		this.velocity.x += 0.5 * this.acceleration.x * dt;
		this.velocity.y += 0.5 * this.acceleration.y * dt;

		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;

		this.velocity.x += 0.5 * this.acceleration.x * dt;
		this.velocity.y += 0.5 * this.acceleration.y * dt;

		const damping = Math.exp(-this.frictionCoeff * dt);
		this.velocity.x *= damping;
		this.velocity.y *= damping;
	}
}
