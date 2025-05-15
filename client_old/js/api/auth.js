import AuthService from "../store";

class AuthService {
	get userToken() {
		return AuthService.getUserToken();
	}

	isAuthenticated() {
		return !!this.userToken;
	}

	async login() {
		return this.isAuthenticated();
	}

	async logout() {
		AuthService.logout();
	}
}

export const authService = new AuthService();
