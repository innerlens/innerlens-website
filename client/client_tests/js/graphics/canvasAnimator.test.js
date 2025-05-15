import { jest } from '@jest/globals';
import { CanvasAnimator } from "../../../js/graphics/canvasAnimator.js";

describe("CanvasAnimator", () => {
  let canvasMock, ctxMock;

  beforeEach(() => {
    ctxMock = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      scale: 1,
    };

    canvasMock = {
      getContext: jest.fn(() => ctxMock),
      getBoundingClientRect: jest.fn(() => ({ width: 500, height: 300 })),
      width: 0,
      height: 0,
    };

    document.body.innerHTML = `
      <canvas id="background-canvas"></canvas>
      <header></header>
    `;
  });

  test("initializes and attaches resize listener", () => {
    const animator = new CanvasAnimator(canvasMock);
    expect(animator.canvas).toBe(canvasMock);
    expect(animator.ctx).toBe(ctxMock);
    expect(canvasMock.getContext).toHaveBeenCalledWith("2d");
  });

  test("start() begins animation loop", () => {
    const animator = new CanvasAnimator(canvasMock);
    animator.animate = jest.fn(); 
    animator.start();
    expect(animator.running).toBe(true);
    expect(animator.animate).toHaveBeenCalled();
  });

  test("stop() halts animation", () => {
    const animator = new CanvasAnimator(canvasMock);
    animator.running = true;
    animator.stop();
    expect(animator.running).toBe(false);
  });

  test("addParticle() stores particle in array", () => {
    const animator = new CanvasAnimator(canvasMock);
    animator.addParticle(
      { x: 0.1, y: 0.1 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      0.05,
      { color: "#000" },
      {}
    );
    expect(animator.particles.length).toBe(1);
  });

  test("resizeCanvasToDisplaySize updates canvas size and style", () => {
    const animator = new CanvasAnimator(canvasMock);
    canvasMock.getBoundingClientRect.mockReturnValue({ width: 500, height: 400 });

    animator.resizeCanvasToDisplaySize();

    expect(canvasMock.width).toBeGreaterThan(0);
    expect(canvasMock.height).toBeGreaterThan(0);
    expect(ctxMock.max_x).toBe(canvasMock.width);
    expect(ctxMock.max_y).toBe(canvasMock.height);
  });
});
