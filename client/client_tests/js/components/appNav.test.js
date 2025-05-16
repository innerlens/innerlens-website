/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../js/state/appState.js", () => ({
  default: {
    getState: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.unstable_mockModule("../../../js/config/appNavConfig.js", () => ({
  AppNavItems: {
    testPage: {
      signedIn: { navLinks: ["profile"], buttons: ["logout"] },
      signedOut: { navLinks: ["home"], buttons: ["login"] },
    },
  },
  getNavLinkById: jest.fn((id) => ({ href: id, text: `${id}Text` })),
  getButtonById: jest.fn((id) => ({
    class: `${id}Class`,
    text: `${id}Text`,
    onClick: jest.fn(),
  })),
  eventsToRender: new Set(["USER_SIGN_IN", "USER_SIGN_OUT"]),
}));

jest.unstable_mockModule("../../../js/util/dom.js", () => ({
  createElement: jest.fn((tag, options = {}) => {
    const el = document.createElement(tag);
    if (options.id) el.id = options.id;
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([k, v]) =>
        el.setAttribute(k, v)
      );
    }
    if (options.events) {
      Object.entries(options.events).forEach(([e, cb]) =>
        el.addEventListener(e, cb)
      );
    }
    return el;
  }),
  removeElementWithId: jest.fn((id) => {
    document.getElementById(id)?.remove();
  }),
}));

const { default: appNav } = await import("../../../js/components/appNav.js");
const appState = (await import("../../../js/state/appState.js")).default;
const { createElement } = await import("../../../js/util/dom.js");

describe("AppNav", () => {
  beforeEach(() => {
    document.body.innerHTML = `<header></header>`;
    jest.clearAllMocks();
  });

  test("renders signed-out navigation", () => {
    appState.getState.mockReturnValue({
      currentPage: "testPage",
      isUserSignedIn: false,
    });

    appNav.render();

    const nav = document.getElementById("header-nav");
    expect(nav).not.toBeNull();
    expect(nav.querySelector("a").textContent).toBe("homeText");
    expect(nav.querySelector("button").textContent).toBe("loginText");
  });

  test("renders signed-in navigation", () => {
    appState.getState.mockReturnValue({
      currentPage: "testPage",
      isUserSignedIn: true,
    });

    appNav.render();

    expect(document.getElementById("header-nav")).not.toBeNull();
    expect(document.querySelector("a").textContent).toBe("profileText");
    expect(document.querySelector("button").textContent).toBe("logoutText");
  });

  test("reacts to relevant state events", () => {
    const state = { currentPage: "testPage", isUserSignedIn: false };
    appState.getState.mockReturnValue(state); 

    const renderSpy = jest.spyOn(appNav, "render");
    appNav._onStateChange("USER_SIGN_IN", state);

    expect(renderSpy).toHaveBeenCalledWith(state);
  });


  test("ignores irrelevant state events", () => {
    const renderSpy = jest.spyOn(appNav, "render");
    appNav._onStateChange("UNTRACKED_EVENT", {});
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test("subscribes to state changes on construction", async () => {
  const { AppNav } = await import("../../../js/components/appNav.js");
  new AppNav();

  expect(appState.subscribe).toHaveBeenCalledWith(expect.any(Function));
});
});
