class AuthService {
	static isAuthenticated() {
		return !!localStorage.getItem("userToken");
	}

	static getAuthHeader() {
		const token = localStorage.getItem("userToken");
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	static getUserToken() {
		return localStorage.getItem("userToken");
	}

	static setUserToken(token) {
		localStorage.setItem("userToken", token);
	}

	static logout() {
		localStorage.removeItem("userToken");
		window.location.reload();
		window.location.href = "/#home";
	}

	static getGoogleSub() {
		if (!this.getUserToken()) return null;
		const base64Payload = this.getUserToken().split(".")[1];
		const decodedPayload = JSON.parse(atob(base64Payload));
		return decodedPayload.sub;
	}

	static withAuthorisationCheck(methodName, ...args) {
		const authToken = AuthService.getAuthHeader()["Authorization"];

		if (!authToken) {
			console.error(
				`Authentication failed for static method: ${methodName}`
			);
			return { error: "Unauthorized" };
		}
		return undefined;
	}

	static applyAuthChecktOMethods(target) {
		for (const key of Object.getOwnPropertyNames(target)) {
			if (
				typeof target[key] === "function" &&
				target.hasOwnProperty(key)
			) {
				const originalMethod = target[key];
				target[key] = function (...args) {
					const authResult = AuthService.withAuthorisationCheck(
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

export default AuthService;
