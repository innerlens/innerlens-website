import SessionManager from "../logic/session_manager.js";

export const Navigation = {
	navLinks: [
		{
			href: "home",
			text: "Home",
			states: ["landing signed out", "landing signed in", "test"],
		},
		{
			href: "my-personality",
			text: "My Personality",
			states: ["landing signed out", "landing signed in"],
		},
		{
			href: "personality-types",
			text: "Personality Types",
			states: ["landing signed out", "landing signed in"],
		},
	],

	buttons: [
		{
			id: "sign-in-button",
			class: "secondary-button",
			onClick: SessionManager.signIn,
			text: "Sign In",
			states: ["landing signed out"],
		},
		{
			id: "sign-out-button",
			class: "secondary-button",
			onClick: SessionManager.signOut,
			text: "Sign Out",
			states: ["landing signed in"],
		},
	],

	render(page) {
		document.getElementById("header-nav")?.remove();

		let state = page;

		if (page === "landing") {
			state += SessionManager.isUserSignedIn
				? " signed in"
				: " signed out";
		}

		const navHtml = this.navLinks
			.filter((link) => link.states.includes(state))
			.map(
				(link) => `
            <li class="nav-item">
                <a class="nav-link ${link.href}" href="/#${link.href}">${link.text}</a>
            </li>
        `
			)
			.join("");

		const buttonHtml = this.buttons
			.filter((button) => button.states.includes(state))
			.map(
				(button) => `
            <li class="nav-item">
                <button class="${button.class}" id="${button.id}">${button.text}</button>
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

		this.buttons.forEach((button) => {
			const btnElem = document.getElementById(button.id);
			if (btnElem) btnElem.addEventListener("click", button.onClick);
		});
	},
};
