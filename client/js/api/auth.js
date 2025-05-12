import { GlobalState } from "../store";

class AuthService {
  clientId = "346787702480-6scg2plhkh4br3j3ns3jg0e333ekdlqi.apps.googleusercontent.com";
  redirectUri = "http://localhost:8000/google";
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

  async sendCode(code) {
    try {
      const response = await fetch("http://localhost:3000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data.jwt) {
        GlobalState.setUserToken(data.jwt);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  }

  async loginWithGoogle() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const success = await this.sendCode(code);
      if (success) {
        alert("Login successful!"); // TODO: redirect to success page
        window.history.replaceState({}, document.title, "/");
        return true;
      } else {
        alert("Login failed."); // TODO: redirect to unsuccessfull page
        return false;
      }
    } else {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      window.location.href = authUrl;
    }
  }
}

export const authService = new AuthService();
