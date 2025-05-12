import AuthService from "../logic/auth_service.js";
import { API_BASE_URL } from "../utils/constants.js";

class ApiClient {
	/**
	 * Sends a GET request to the specified endpoint.
	 * @param {string} endpoint - The endpoint to send the request to.
	 * @param {boolean} requiresAuth - Optional. Indicates if the request requires authorization. Defaults to true.
	 * @returns {Promise<Response>} - The response from the server.
	 */
	static async get(endpoint, requiresAuth = true) {
		const headers = {
			"Content-Type": "application/json",
		};
		if (requiresAuth) {
			const authHeader = AuthService.getAuthHeader();
			Object.assign(headers, authHeader); // Merge headers with authHeader
		}

		try {
			const response = await fetch(API_BASE_URL + endpoint, {
				headers,
				method: "GET",
			});

			if (!response.ok) {
				// Handle errors based on the response status
				const errorData = await response.json();
				console.error("Error from server:", errorData);
				throw new Error(
					`Request failed with status: ${response.status}`
				);
			}

			// Parse and return the JSON response if it's successful
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error during GET request:", error.message);
			throw error; // Re-throw the error to be handled upstream
		}
	}

	/**
	 * Sends a POST request to the specified endpoint.
	 * @param {string} endpoint - The endpoint to send the request to.
	 * @param {object} body - The request body.
	 * @returns {Promise<Response>} - The response from the server.
	 */
	static async post(endpoint, body) {
		const headers = {
			"Content-Type": "application/json",
		};
		return await fetch(API_BASE_URL + endpoint, {
			headers,
			method: "POST",
			body: JSON.stringify(body),
			headers: AuthService.getAuthHeader(),
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.error(error);
			});
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
		return await fetch(API_BASE_URL + endpoint, {
			headers,
			method: "PUT",
			body: JSON.stringify(body),
			headers: AuthService.getAuthHeader(),
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
		return await fetch(API_BASE_URL + endpoint, {
			headers,
			method: "PATCH",
			body: JSON.stringify(body),
			headers: AuthService.getAuthHeader(),
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
		return await fetch(API_BASE_URL + endpoint, {
			headers,
			method: "DELETE",
			headers: AuthService.getAuthHeader(),
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.error(error);
			});
	}
}

export default ApiClient;
