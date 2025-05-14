import { CONFIG } from "../config/config.js";
import ApiClient from "../api/api_client.js";
import AuthService from "./auth_service.js";

class SessionManager {
	static username = null;
	static isUserSignedIn = AuthService.isAuthenticated();
	static hasTakenTest = false;

	static async isLoggedIn() {
		const sub = AuthService.getGoogleSub();
		if (!sub) return false;

		try {
			const { userExists } = await ApiClient.get(
				`/api/user/google/${sub}`
			);
			return userExists;
		} catch (err) {
			console.error("Login check failed:", err.message);
			return false;
		}
	}

	static signIn() {
		window.location.href = CONFIG.AUTH_URI;
	}

	static signOut() {
		AuthService.logout();
	}

	static startTest() {
		window.location.href = "/test";
	}
}

export default SessionManager;
