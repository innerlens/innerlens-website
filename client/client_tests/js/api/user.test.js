import { jest } from "@jest/globals";
import userApi from "../../../js/api/user.js";
import ApiClient from "../../../js/api/apiClient.js";

describe("UserApi", () => {
  beforeEach(() => {
    ApiClient.get = jest.fn(); 
  });

  test("should return user ID if user exists", async () => {
    const fakeSub = "abc123";
    const expectedId = 42;

    ApiClient.get.mockResolvedValueOnce({ userExists: true, id: expectedId });

    const userId = await userApi.getUserIdFromSub(fakeSub);
    expect(ApiClient.get).toHaveBeenCalledWith(`/api/user/google/${fakeSub}`);
    expect(userId).toBe(expectedId);
  });

  test("should return null if user does not exist", async () => {
    const fakeSub = "xyz999";

    ApiClient.get.mockResolvedValueOnce({ userExists: false });

    const userId = await userApi.getUserIdFromSub(fakeSub);
    expect(ApiClient.get).toHaveBeenCalledWith(`/api/user/google/${fakeSub}`);
    expect(userId).toBeNull();
  });
});
