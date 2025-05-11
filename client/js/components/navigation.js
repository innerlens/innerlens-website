import { ScrollHandler } from "../logic/scroll_handler.js";

export const Navigation = {
	navLinks: [
		{ href: "home", text: "Home" },
		{ href: "my-personality", text: "My Personality" },
		{ href: "personality-types", text: "Personality Types" },
	],

	buttons: [{ class: "secondary-button", text: "Sign In" }],

	render() {
		const navHtml = this.navLinks
			.map(
				(link) => `
            <li class="nav-item">
                <a class="nav-link ${link.href}" href="/#${link.href}">${link.text}</a>
            </li>
        `
			)
			.join("");

		const buttonHtml = this.buttons
			.map(
				(button) => `
            <li class="nav-item">
                <button class="${button.class}">${button.text}</button>
            </li>
        `
			)
			.join("");

		const nav = document.createElement("nav");
		nav.id = "header-nav";

		nav.innerHTML = `
            <ul id="header-ul">
                ${navHtml}
                ${buttonHtml}
            </ul>
        `;

		const parent = document.querySelector("header");
		parent.appendChild(nav);

		ScrollHandler.addHighlighting();
	},
};
