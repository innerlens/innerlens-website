import userApi from "../api/user.js";

class AuthService {
	constructor() {
		this.id = null;
	}

	async init() {
		const sub = this.getGoogleSub();

		if (!sub) return;

		this.id = await userApi.getUserIdFromSub(sub);

		if (!this.id) this.logout();

		return this.id;
	}

	isAuthenticated() {
		return !!localStorage.getItem("userToken");
	}

	getAuthHeader() {
		const token = localStorage.getItem("userToken");
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	getUserToken() {
		return localStorage.getItem("userToken");
	}

	setUserToken(token) {
		localStorage.setItem("userToken", token);
	}

	logout() {
		localStorage.removeItem("userToken");
		window.location.reload();
		window.location.href = "/#home";
	}

	getDecodedPayload() {
		if (!this.getUserToken()) return null;
		const base64Payload = this.getUserToken().split(".")[1];
		return JSON.parse(atob(base64Payload));
	}

	getGoogleSub() {
		const decodedPayload = this.getDecodedPayload();
		return decodedPayload?.sub || null;
	}

	getUsername() {
		const decodedPayload = this.getDecodedPayload();
		return decodedPayload?.name || null;
	}

	withAuthorisationCheck(methodName, ...args) {
		const authToken = authService.getAuthHeader()["Authorization"];

		if (!authToken) {
			console.error(
				`Authentication failed for static method: ${methodName}`
			);
			return { error: "Unauthorized" };
		}
		return undefined;
	}

	applyAuthChecktOMethods(target) {
		for (const key of Object.getOwnPropertyNames(target)) {
			if (
				typeof target[key] === "function" &&
				target.hasOwnProperty(key)
			) {
				const originalMethod = target[key];
				target[key] = function (...args) {
					const authResult = authService.withAuthorisationCheck(
						key,
						...args
					);
					if (authResult && authResult.error) {
						return authResult;
					}
					return originalMethod.apply(this, args);
				};
			}
		}
	}
}

const authService = new AuthService();
export default authService;
