import SessionManager from "../../../logic/session_manager.js";

export const MyPersonalitySection = {
	render() {
		const article = document.createElement("article");
		article.id = "my-personality";

		let innerHtml = `<h2>My Personality</h2>`;

		if (!SessionManager.isUserSignedIn) {
			innerHtml += `
                <p>Please sign in to view your personality type.</p>
                <button class="primary-button">Sign In</button>
            `;
		} else if (!SessionManager.hasTakenTest) {
			innerHtml += `
                <p>You haven't taken the personality test yet.</p>
                <button class="primary-button">Take the Test</button>
            `;
		} else {
			innerHtml += `
                <p>Your personality type is: <strong>[Your Type Here]</strong></p>
                <button class="secondary-button">Retake Test</button>
            `;
		}

		article.innerHTML = innerHtml;

		const parent = document.getElementById("landing-page");
		parent.appendChild(article);
	},
};
