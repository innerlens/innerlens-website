import { GlobalState } from "../store";

class AuthService {
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
