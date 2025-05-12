import { GlobalState } from "../store";

class AuthService {
  clientId = process.env.GOOGLE_CLIENT_ID;
  redirectUri = process.env.GOOGLE_REDIRECT_URI;
  scope = "openid email profile";

  userToken = GlobalState.getUserToken();

  isAuthenticated() {
    if (this.userToken) {
      return true;
    } else {
      return false;
    }
  }

  async login() {
    let isAuthenticated = this.isAuthenticated();
    if (isAuthenticated) {
      return true;
    } else {
      return false;
    }
  }

  async logout() {
    GlobalState.logout();
  }
}

export const authService = new AuthService();
