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

	addParticle(
		position,
		velocity,
		acceleration,
		radius,
		style,
		movementConfig = {}
	) {
		this.particles.push(
			new Particle(
				position,
				velocity,
				acceleration,
				radius,
				style,
				movementConfig
			)
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
	constructor(
		position,
		velocity,
		acceleration,
		radius,
		style,
		movementConfig = {}
	) {
		this.position = { ...position };
		this.originalPosition = { ...position };
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.radius = radius;
		this.style = { ...style };

		this.movementConfig = {
			maxDistance: movementConfig.maxDistance || 0.03,
			frequency: movementConfig.frequency || this.randomRange(0.5, 1.5),
			phaseX: movementConfig.phaseX || Math.random() * Math.PI * 2,
			phaseY: movementConfig.phaseY || Math.random() * Math.PI * 2,
			amplitudeRatioX:
				movementConfig.amplitudeRatioX || this.randomRange(0.7, 1.3),
			amplitudeRatioY:
				movementConfig.amplitudeRatioY || this.randomRange(0.7, 1.3),
			friction: movementConfig.friction || this.randomRange(2.5, 3.5),
			jitter: movementConfig.jitter || this.randomRange(0, 0.0005),
			secondaryFrequency:
				movementConfig.secondaryFrequency || this.randomRange(0.2, 0.5),
			secondaryAmplitude:
				movementConfig.secondaryAmplitude || this.randomRange(0.1, 0.3),
		};

		this.time = Math.random() * 1000;
	}

	randomRange(min, max) {
		return Math.random() * (max - min) + min;
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
		this.time += dt;

		const {
			maxDistance,
			frequency,
			phaseX,
			phaseY,
			amplitudeRatioX,
			amplitudeRatioY,
			friction,
			jitter,
			secondaryFrequency,
			secondaryAmplitude,
		} = this.movementConfig;

		const oscillationX = Math.sin(
			this.time * frequency * Math.PI * 2 + phaseX
		);
		const oscillationY = Math.cos(
			this.time * frequency * Math.PI * 2 + phaseY
		);

		const secondaryOscX = Math.sin(
			this.time * secondaryFrequency * Math.PI * 2 + phaseX * 0.7
		);
		const secondaryOscY = Math.cos(
			this.time * secondaryFrequency * Math.PI * 2 + phaseY * 0.7
		);

		const targetX =
			this.originalPosition.x +
			maxDistance * oscillationX * amplitudeRatioX +
			maxDistance * secondaryOscX * secondaryAmplitude;
		const targetY =
			this.originalPosition.y +
			maxDistance * oscillationY * amplitudeRatioY +
			maxDistance * secondaryOscY * secondaryAmplitude;

		const forceX = (targetX - this.position.x) * 2;
		const forceY = (targetY - this.position.y) * 2;

		this.acceleration.x = forceX + (Math.random() * 2 - 1) * jitter;
		this.acceleration.y = forceY + (Math.random() * 2 - 1) * jitter;

		this.velocity.x += 0.5 * this.acceleration.x * dt;
		this.velocity.y += 0.5 * this.acceleration.y * dt;

		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;

		this.velocity.x += 0.5 * this.acceleration.x * dt;
		this.velocity.y += 0.5 * this.acceleration.y * dt;

		const damping = Math.exp(-friction * dt);
		this.velocity.x *= damping;
		this.velocity.y *= damping;
	}
}
