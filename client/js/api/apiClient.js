import { GlobalState } from "../store";

const API_BASE_URL = "http://localhost:3000";

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
      const authHeader = GlobalState.getAuthHeader();
      Object.assign(headers, authHeader);
    }
    return await fetch(API_BASE_URL + endpoint, {
      headers,
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
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
      headers: GlobalState.getAuthHeader(),
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
      headers: GlobalState.getAuthHeader(),
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
      headers: GlobalState.getAuthHeader(),
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
      headers: GlobalState.getAuthHeader(),
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
