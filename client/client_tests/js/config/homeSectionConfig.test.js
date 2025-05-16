/**
 * @jest-environment jsdom
 */
import { HomeSectionItems, eventsToRender } from "../../../js/config/homeSectionConfig.js";
import AppEvent from "../../../js/enums/appEvent.js";

describe("HomeSectionItems", () => {
  it("should return correct button config for signedIn state", () => {
    const btnConfig = HomeSectionItems.signedIn.buttons;
    expect(btnConfig.class).toBe("primary-button");
    expect(btnConfig.text).toBe("Start Personality Test");
    expect(typeof btnConfig.onClick).toBe("function");
  });

  it("should return correct button config for signedOut state", () => {
    const btnConfig = HomeSectionItems.signedOut.buttons;
    expect(btnConfig.class).toBe("primary-button");
    expect(btnConfig.text).toBe("Sign In to Take Test");
    expect(typeof btnConfig.onClick).toBe("function");
  });
});

describe("eventsToRender", () => {
  it("should include USER_SIGNED_IN and USER_SIGNED_OUT", () => {
    expect(eventsToRender.has(AppEvent.USER_SIGNED_IN)).toBe(true);
    expect(eventsToRender.has(AppEvent.USER_SIGNED_OUT)).toBe(true);
  });

  it("should not include unrelated events", () => {
    expect(eventsToRender.has("RANDOM_EVENT")).toBe(false);
  });
});
