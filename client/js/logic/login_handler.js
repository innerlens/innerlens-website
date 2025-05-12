import { authURI } from "../utils/constants.js";

export function loadGoogleLoginPage() {
    const button = document.querySelector("#google-signin");
    button?.addEventListener('click', () => {
        window.location.href = authURI;
    });
}