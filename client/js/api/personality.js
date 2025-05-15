import ApiClient from "./apiClient.js";

class PersonalityApi {
	async getAllPersonalityTypes() {
		return await ApiClient.get("/api/personality");
	}

	async getAllPersonalityTraits() {
		return await ApiClient.get("/api/trait");
	}
}

const personalityApi = new PersonalityApi();
export default personalityApi;
