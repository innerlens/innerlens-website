import ApiClient from "./apiClient.js";

class PersonalityApi {
	async getAllPersonalityTypes() {
		return await ApiClient.get("/api/personality");
	}
}

const personalityApi = new PersonalityApi();
export default personalityApi;
