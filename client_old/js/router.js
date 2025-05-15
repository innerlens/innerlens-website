import { TestPage } from "./pages/test_page/test_page.js";
import { LandingPage } from "./pages/landing_page/landing_page.js";

const routes = {
	landingPage: () => LandingPage.render(),
	test: () => {
		TestPage.render();
	},
};

function router() {
	const path = window.location.pathname.split("/")[1] || "landingPage";

	if (routes[path]) {
		routes[path]();
	} else {
		document.body.innerHTML = `<p>404 - Page not found</p>`;
	}
}

window.addEventListener("popstate", router);
window.addEventListener("load", router);
