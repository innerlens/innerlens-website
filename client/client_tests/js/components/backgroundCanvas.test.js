/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../js/util/dom.js", () => ({
  createElement: jest.fn((tag, { id, className, text, attributes, events } = {}) => {
  const el = document.createElement(tag);
  if (id) el.id = id;
  if (className) el.className = className;
  if (text) el.textContent = text;
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => el.setAttribute(key, val));
  }
  if (events) {
    Object.entries(events).forEach(([event, handler]) => el.addEventListener(event, handler));
  }
  return el;
}),

}));

jest.unstable_mockModule("../../../js/graphics/canvasAnimator.js", () => ({
  CanvasAnimator: jest.fn().mockImplementation(() => ({
    addParticle: jest.fn(),
    start: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../../js/config/backgroundCanvasConfig.js", () => ({
  Particles: [
    {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      radius: 0.5,
      style: { color: "#000" },
      movement: {},
    },
  ],
}));

const { BackgroundCanvas } = await import("../../../js/components/backgroundCanvas.js");
const { createElement } = await import("../../../js/util/dom.js");
const { CanvasAnimator } = await import("../../../js/graphics/canvasAnimator.js");
const { Particles } = await import("../../../js/config/backgroundCanvasConfig.js");

describe("BackgroundCanvas", () => {
  let bg;

  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    bg = new BackgroundCanvas();
  });

  test("renders canvas and starts animation", () => {
    bg.render();

    expect(createElement).toHaveBeenCalledWith("canvas", { id: "background-canvas" });
    expect(document.getElementById("background-canvas")).not.toBeNull();

    expect(CanvasAnimator).toHaveBeenCalledWith(expect.any(HTMLCanvasElement));
    expect(bg.canvasAnimator.start).toHaveBeenCalled();
  });

  test("adds particles to canvas animator", () => {
    bg.render();

    const added = bg.canvasAnimator.addParticle;
    expect(added).toHaveBeenCalledTimes(Particles.length);
    expect(added).toHaveBeenCalledWith(
      Particles[0].position,
      Particles[0].velocity,
      Particles[0].acceleration,
      Particles[0].radius,
      Particles[0].style,
      Particles[0].movement
    );
  });
});
