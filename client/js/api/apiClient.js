import authService from "../services/authService.js";
import PATH from "../enums/path.js";
import HttpStatus from "../enums/httpStatus.js";

class ApiClient {
	static async get(endpoint, requiresAuth = true) {
		const headers = { "Content-Type": "application/json" };
		if (requiresAuth) Object.assign(headers, authService.getAuthHeader());

		try {
			const res = await fetch(PATH.API_BASE_URL + endpoint, {
				method: "GET",
				headers,
			});
			if (!res.ok) {
				const err = await res.json();
				this.handleError(res.status, err);
				throw new Error(`Request failed: ${res.status}`);
			}
			return await res.json();
		} catch (e) {
			console.error("GET request error:", e.message);
			throw e;
		}
	}

	static async post(endpoint, body, requiresAuth = true) {
		const headers = { "Content-Type": "application/json" };
		if (requiresAuth) Object.assign(headers, authService.getAuthHeader());

		try {
			const res = await fetch(PATH.API_BASE_URL + endpoint, {
				method: "POST",
				headers,
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const err = await res.json();
				this.handleError(res.status, err);
				throw new Error(`Request failed: ${res.status}`);
			}
			return await res.json();
		} catch (e) {
			console.error("POST request error:", e.message);
			throw e;
		}
	}

	static async put(endpoint, body, requiresAuth = true) {
		const headers = { "Content-Type": "application/json" };
		if (requiresAuth) Object.assign(headers, authService.getAuthHeader());

		try {
			const res = await fetch(PATH.API_BASE_URL + endpoint, {
				method: "PUT",
				headers,
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const err = await res.json();
				this.handleError(res.status, err);
				throw new Error(`Request failed: ${res.status}`);
			}
			return await res.json();
		} catch (e) {
			console.error("PUT request error:", e.message);
			throw e;
		}
	}

	static async patch(endpoint, body, requiresAuth = true) {
		const headers = { "Content-Type": "application/json" };
		if (requiresAuth) Object.assign(headers, authService.getAuthHeader());

		try {
			const res = await fetch(PATH.API_BASE_URL + endpoint, {
				method: "PATCH",
				headers,
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const err = await res.json();
				this.handleError(res.status, err);
				throw new Error(`Request failed: ${res.status}`);
			}
			return await res.json();
		} catch (e) {
			console.error("PATCH request error:", e.message);
			throw e;
		}
	}

	static async delete(endpoint, requiresAuth = true) {
		const headers = { "Content-Type": "application/json" };
		if (requiresAuth) Object.assign(headers, authService.getAuthHeader());

		try {
			const res = await fetch(PATH.API_BASE_URL + endpoint, {
				method: "DELETE",
				headers,
			});
			if (!res.ok) {
				const err = await res.json();
				this.handleError(res.status, err);
				throw new Error(`Request failed: ${res.status}`);
			}
			return await res.json();
		} catch (e) {
			console.error("DELETE request error:", e.message);
			throw e;
		}
	}

	static handleError(status, errorData) {
		console.error("Error from server:", errorData);

		switch (status) {
			case HttpStatus.UNAUTHORIZED:
				console.warn("Not authenticated.");
				authService.logout();
				break;
			case HttpStatus.FORBIDDEN:
				console.warn("Not authorized.");
				alert("Access denied.");
				authService.logout();
				break;
			default:
				console.error(`Unhandled error: ${status}`);
		}
	}
}

export default ApiClient;
