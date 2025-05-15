/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

describe("LandingPage", () => {
  let clearElement, createElement, homeSection, myPersonalitySection, LandingPage;

  beforeEach(async () => {
    document.body.innerHTML = `<main></main>`;

    jest.resetModules();

    jest.doMock("../../../js/util/dom.js", () => ({
      __esModule: true,
      clearElement: jest.fn(),
      createElement: jest.fn((tag, { id }) => {
        const el = document.createElement(tag);
        if (id) el.id = id;
        return el;
      }),
    }));

    jest.doMock("../../../js/sections/homeSection.js", () => ({
      __esModule: true,
      default: { render: jest.fn() },
    }));

    jest.doMock("../../../js/sections/myPersonalitySection.js", () => ({
      __esModule: true,
      default: { render: jest.fn() },
    }));

    const dom = await import("../../../js/util/dom.js");
    clearElement = dom.clearElement;
    createElement = dom.createElement;

    homeSection = (await import("../../../js/sections/homeSection.js")).default;
    myPersonalitySection = (await import("../../../js/sections/myPersonalitySection.js")).default;

    LandingPage = (await import("../../../js/pages/landingPage.js")).LandingPage;
  });

  test("renders landing page section and calls sub-renders", () => {
    const landingPage = new LandingPage();

    landingPage.render();

    const section = document.getElementById("landing-page");
    expect(section).not.toBeNull();
  });
});
