import ApiClient from "./apiClient.js";

class UserApi {
	async getUserIdFromSub(sub) {
		const response = await ApiClient.get(`/api/user/google/${sub}`);

		if (response.userExists) {
			return response.id;
		} else {
			return null;
		}
	}
}

const userApi = new UserApi();
export default userApi;
