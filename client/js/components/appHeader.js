import { createElement, clearElement } from "../util/dom.js";
import appNav from "./appNav.js";

class AppHeader {
	constructor() {
		this.title = "innerlens";
		this.parentName = "header";
	}

	render() {
		const title = createElement("h1", { text: this.title });
		const parent = document.querySelector(this.parentName);

		clearElement(parent);
		parent.appendChild(title);

		appNav.render();
	}
}

const appHeader = new AppHeader();
export default appHeader;
