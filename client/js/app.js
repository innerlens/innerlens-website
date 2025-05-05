import { TestPage } from './pages/test_page.js';
import { Canvas } from './components/canvas.js';
import { CanvasAnimator } from './logic/canvas_renderer.js';

const backgroundCanvas = new Canvas('background-canvas');
backgroundCanvas.render(document.body);

document.body.appendChild(document.createElement('main'));

TestPage.render();

const canvasAnimator = new CanvasAnimator(backgroundCanvas.canvas); 
canvasAnimator.start();

// canvasAnimator.addParticle({x: -0.107,y: -0.194}, {x: 0,y: 0}, {x: 0,y: 0}, 374, {color: "#3F22BF"});
// canvasAnimator.addParticle({x: -0.152,y: -0.047}, {x: 0,y: 0}, {x: 0,y: 0}, 181, {color: "#F2D06C"});
// canvasAnimator.addParticle({x: -0.013,y: -0.117}, {x: 0,y: 0}, {x: 0,y: 0}, 317, {color: "#C57A48"});
// canvasAnimator.addParticle({x: -0.192,y: -0.224}, {x: 0,y: 0}, {x: 0,y: 0}, 455, {color: "#F26C6C"});

// canvasAnimator.addParticle({x: 0.718,y: 0.872}, {x: 0,y: 0}, {x: 0,y: 0}, 350, {color: "#F2D06C"});
// canvasAnimator.addParticle({x: 0.801,y: 0.591}, {x: 0,y: 0}, {x: 0,y: 0}, 317, {color: "#C57A48"});
// canvasAnimator.addParticle({x: 0.599,y: 0.757}, {x: 0,y: 0}, {x: 0,y: 0}, 352, {color: "#3F22BF"});
// canvasAnimator.addParticle({x: 0.801,y: 0.499}, {x: 0,y: 0}, {x: 0,y: 0}, 352, {color: "#3F22BF"});
// canvasAnimator.addParticle({x: 0.634,y: 0.560}, {x: 0,y: 0}, {x: 0,y: 0}, 376, {color: "#F26C6C"});


canvasAnimator.addParticle({x: 0.830, y: 0.909}, {x: 0,y: 0}, {x: 0,y: 0}, 376, {color: "#F26C6C"});
canvasAnimator.addParticle({x: 0.985, y: 0.825}, {x: 0,y: 0}, {x: 0,y: 0}, 352, {color: "#3F22BF"});
canvasAnimator.addParticle({x: 0.783, y: 1.083}, {x: 0,y: 0}, {x: 0,y: 0}, 352, {color: "#3F22BF"});
canvasAnimator.addParticle({x: 0.965, y: 0.885}, {x: 0,y: 0}, {x: 0,y: 0}, 317, {color: "#C57A48"});
canvasAnimator.addParticle({x: 0.900, y: 1.195}, {x: 0,y: 0}, {x: 0,y: 0}, 350, {color: "#F2D06C"});

canvasAnimator.addParticle({x: 0.045, y: 0.023}, {x: 0,y: 0}, {x: 0,y: 0}, 455, {color: "#F26C6C"});
canvasAnimator.addParticle({x: 0.152, y: 0.085}, {x: 0,y: 0}, {x: 0,y: 0}, 317, {color: "#C57A48"});
canvasAnimator.addParticle({x: 0.246, y: 0.085}, {x: 0,y: 0}, {x: 0,y: 0}, 181, {color: "#F2D06C"});
canvasAnimator.addParticle({x: 0.087, y: 0}, {x: 0,y: 0}, {x: 0,y: 0}, 374, {color: "#3F22BF"});