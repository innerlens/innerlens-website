import { jest } from '@jest/globals';
import ApiClient from "../../../js/api/apiClient.js";
import PATH from "../../../js/enums/path.js";
import authService from "../../../js/services/authService.js";

Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn(),
    href: "/"
  },
  writable: true
});

global.fetch = jest.fn();

authService.getAuthHeader = jest.fn(() => ({ Authorization: "Bearer test-token" }));
authService.logout = jest.fn();

describe("ApiClient", () => {
  beforeEach(() => {
    fetch.mockClear();
    authService.logout.mockClear();
  });

  it("should make a GET request with auth header", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const data = await ApiClient.get("/test");

    expect(fetch).toHaveBeenCalledWith(PATH.API_BASE_URL + "/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    });

    expect(data).toEqual({ success: true });
  });

  it("should handle unauthorized GET", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Unauthorized" }),
    });

    await expect(ApiClient.get("/test")).rejects.toThrow("Request failed: 401");
    expect(authService.logout).toHaveBeenCalled();
  });

  it("should make a POST request with JSON body", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123 }),
    });

    const body = { name: "test" };
    const data = await ApiClient.post("/submit", body);

    expect(fetch).toHaveBeenCalledWith(PATH.API_BASE_URL + "/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify(body),
    });

    expect(data).toEqual({ id: 123 });
  });
});
