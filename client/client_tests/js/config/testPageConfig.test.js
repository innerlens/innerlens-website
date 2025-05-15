import { eventsToRender } from "../../../js/config/testPageConfig.js";
import TestEvent from "../../../js/enums/testEvent.js";

describe("eventsToRender", () => {
  it("should include TestEvent.QUESTIONS_LOADED", () => {
    expect(eventsToRender.has(TestEvent.QUESTIONS_LOADED)).toBe(true);
  });

  it("should only contain expected events", () => {
    expect(Array.from(eventsToRender)).toEqual([TestEvent.QUESTIONS_LOADED]);
  });
});
