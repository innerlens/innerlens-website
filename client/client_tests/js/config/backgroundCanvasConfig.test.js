import { Particles } from "../../../js/config/backgroundCanvasConfig.js";

describe("Particles configuration", () => {
	it("should contain the correct number of particles", () => {
		expect(Particles).toHaveLength(9);
	});

	it("each particle should have correct structure", () => {
		Particles.forEach((particle, index) => {
			expect(particle).toMatchObject({
				position: expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
				velocity: expect.objectContaining({ x: 0, y: 0 }),
				acceleration: expect.objectContaining({ x: 0, y: 0 }),
				radius: expect.any(Number),
				style: expect.objectContaining({ color: expect.stringMatching(/^#([A-Fa-f0-9]{6})$/) }),
				movement: expect.objectContaining({
					maxDistance: expect.any(Number),
					frequency: expect.any(Number),
					friction: expect.any(Number),
					jitter: expect.any(Number),
				}),
			});
		});
	});

	it("all particles should share the same movement configuration", () => {
		const firstMovement = Particles[0].movement;
		Particles.forEach(particle => {
			expect(particle.movement).toEqual(firstMovement);
		});
	});

	it("radius values should be correctly normalized", () => {
		Particles.forEach(particle => {
			expect(particle.radius).toBeGreaterThan(0);
			expect(particle.radius).toBeLessThan(1);
		});
	});
});
