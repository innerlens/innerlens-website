export const PersonalityTypesSection = {
	render() {
		const article = document.createElement("article");
		article.id = "personality-types";

		let innerHtml = `<h2>Personality Types</h2>`;

		article.innerHTML = innerHtml;

		const parent = document.getElementById("landing-page");
		parent.appendChild(article);
	},
};
