import { CanvasAnimator } from "../graphics/canvasAnimator.js";
import { Particles } from "../config/backgroundCanvasConfig.js";
import { createElement } from "../util/dom.js";

class BackgroundCanvas {
	constructor() {
		this.canvas;
		this.id = "background-canvas";
	}

	render() {
		this.canvas = createElement("canvas", { id: this.id });

		const parent = document.body;
		parent.appendChild(this.canvas);

		this.canvasAnimator = new CanvasAnimator(this.canvas);

		Particles.forEach((p) => {
			this.canvasAnimator.addParticle(
				p.position,
				p.velocity,
				p.acceleration,
				p.radius,
				p.style,
				p.movement
			);
		});

		this.canvasAnimator.start();
	}
}

const backgroundCanvas = new BackgroundCanvas();
export default backgroundCanvas;
