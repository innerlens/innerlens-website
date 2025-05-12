export class GlobalState {
  userToken = localStorage.getItem("userToken") || null;
  static isAuthenticated() {
    return !!userToken;
  }

  static getAuthHeader() {
    if (this.isAuthenticated()) {
      return {
        Authorization: `Bearer ${userToken}`,
      };
    } else {
      return {};
    }
  }
  static getUserToken() {
    return userToken;
  }

  static setUserToken(token) {
    localStorage.setItem("userToken", token);
  }

  static logout() {
    localStorage.removeItem("userToken");
    GLOBAL_STORE.userToken = null;
    window.location.href = "/";
  }
}
