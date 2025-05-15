import { jest } from '@jest/globals';
/**
 * @jest-environment jsdom
 */
import {
  clearElement,
  createElement,
  setupBaseLayout,
  removeElementWithId,
  clearElementWithId,
} from "../../../js/util/dom.js";

describe("DOM utility functions", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("clearElement removes all children", () => {
    const div = document.createElement("div");
    div.appendChild(document.createElement("p"));
    document.body.appendChild(div);

    expect(div.children.length).toBe(1);
    clearElement(div);
    expect(div.children.length).toBe(0);
  });

  test("createElement sets properties and attaches events", () => {
    const onClick = jest.fn();
    const el = createElement("button", {
      className: "btn",
      id: "myBtn",
      text: "Click Me",
      attributes: { "data-test": "123" },
      events: { click: onClick },
    });

    expect(el.tagName).toBe("BUTTON");
    expect(el.className).toBe("btn");
    expect(el.id).toBe("myBtn");
    expect(el.textContent).toBe("Click Me");
    expect(el.getAttribute("data-test")).toBe("123");

    el.click();
    expect(onClick).toHaveBeenCalled();
  });

  test("setupBaseLayout clears body and creates header and main", () => {
    document.body.innerHTML = "<div>Old Content</div>";

    setupBaseLayout();

    const header = document.querySelector("header");
    const main = document.querySelector("main");

    expect(document.body.children.length).toBe(2);
    expect(header).not.toBeNull();
    expect(main).not.toBeNull();
  });

  test("removeElementWithId removes the element if it exists", () => {
    const div = document.createElement("div");
    div.id = "toRemove";
    document.body.appendChild(div);

    expect(document.getElementById("toRemove")).not.toBeNull();
    removeElementWithId("toRemove");
    expect(document.getElementById("toRemove")).toBeNull();
  });

  test("clearElementWithId clears content of existing element", () => {
    const div = document.createElement("div");
    div.id = "toClear";
    div.appendChild(document.createElement("p"));
    document.body.appendChild(div);

    clearElementWithId("toClear");

    expect(div.children.length).toBe(0);
  });
});
