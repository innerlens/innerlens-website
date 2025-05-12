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
		window.location.href = "/#home";
		window.location.reload();
	}

	static getGoogleSub() {
		if (!this.getUserToken()) return null;
		const base64Payload = this.getUserToken().split(".")[1];
		const decodedPayload = JSON.parse(atob(base64Payload));
		return decodedPayload.sub;
	}
}

export default AuthService;
