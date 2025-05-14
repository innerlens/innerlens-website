import authService from "../services/auth_service.js";
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

	/**
	 * Sends a PUT request to the specified endpoint.
	 * @param {string} endpoint - The endpoint to send the request to.
	 * @param {object} body - The request body.
	 * @returns {Promise<Response>} - The response from the server.
	 */
	static async put(endpoint, body) {
		const headers = {
			"Content-Type": "application/json",
		};
		return await fetch(PATH.API_BASE_URL + endpoint, {
			headers,
			method: "PUT",
			body: JSON.stringify(body),
			headers: authService.getAuthHeader(),
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.error(error);
			});
	}

	/**
	 * Sends a PATCH request to the specified endpoint.
	 * @param {string} endpoint - The endpoint to send the request to.
	 * @param {object} body - The request body.
	 * @returns {Promise<Response>} - The response from the server.
	 */
	static async patch(endpoint, body) {
		const headers = {
			"Content-Type": "application/json",
		};
		return await fetch(PATH.API_BASE_URL + endpoint, {
			headers,
			method: "PATCH",
			body: JSON.stringify(body),
			headers: authService.getAuthHeader(),
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.error(error);
			});
	}

	/**
	 * Sends a DELETE request to the specified endpoint.
	 * @param {string} endpoint - The endpoint to send the request to.
	 * @returns {Promise<Response>} - The response from the server.
	 */
	static async delete(endpoint) {
		const headers = {
			"Content-Type": "application/json",
		};
		return await fetch(PATH.API_BASE_URL + endpoint, {
			headers,
			method: "DELETE",
			headers: authService.getAuthHeader(),
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.error(error);
			});
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
