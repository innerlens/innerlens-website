import { HeaderContent } from "./components/header_content.js";
import { LandingPage } from "./pages/landing_page/landing_page.js";
import { Canvas } from "./components/canvas.js";
import { CanvasAnimator } from "./logic/canvas_renderer.js";
import { loadGoogleLoginPage } from "./logic/login_handler.js";

const backgroundCanvas = new Canvas("background-canvas");
backgroundCanvas.render(document.body);

createStructure();

LandingPage.render();
HeaderContent.render();

loadGoogleLoginPage();

createBackground();

function createStructure() {
	document.body.appendChild(document.createElement("header"));
	document.body.appendChild(document.createElement("main"));
	document.body.appendChild(document.createElement("footer"));
}

function createBackground() {
	const canvasAnimator = new CanvasAnimator(backgroundCanvas.canvas);
	canvasAnimator.start();

	const movementConfig = {
		maxDistance: 0.05,
		frequency: 0.1,
		friction: 1.0,
		jitter: 0.0008,
	};

	canvasAnimator.addParticle(
		{ x: 0.83, y: 0.909 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		376 / 1080,
		{ color: "#F26C6C" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.985, y: 0.825 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		352 / 1080,
		{ color: "#3F22BF" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.783, y: 1.083 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		352 / 1080,
		{ color: "#3F22BF" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.965, y: 0.885 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		317 / 1080,
		{ color: "#C57A48" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.9, y: 1.195 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		350 / 1080,
		{ color: "#F2D06C" },
		movementConfig
	);

	canvasAnimator.addParticle(
		{ x: 0.045, y: 0.023 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		455 / 1080,
		{ color: "#F26C6C" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.152, y: 0.085 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		317 / 1080,
		{ color: "#C57A48" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.246, y: 0.085 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		181 / 1080,
		{ color: "#F2D06C" },
		movementConfig
	);
	canvasAnimator.addParticle(
		{ x: 0.087, y: 0.0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		374 / 1080,
		{ color: "#3F22BF" },
		movementConfig
	);
}
