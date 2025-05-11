import { TestPage } from './pages/test_page/test_page.js';
import { LandingPage } from './pages/landing_page/landing_page.js';

const routes = {
    landingPage: () => LandingPage.render(),
    test: () => {
        TestPage.render()
    },
};

function router() {
    // Get the path from the URL and remove the leading '/'
    const path = window.location.pathname.split('/')[1] || 'landingPage';

    console.log(`Routing to: ${path}`);

    if (routes[path]) {
        routes[path]();
    } else {
        document.body.innerHTML = `<p>404 - Page not found</p>`; // set 404 message
    }
}

window.addEventListener('popstate', router); // Use 'popstate' for browser history navigation
window.addEventListener('load', router);
