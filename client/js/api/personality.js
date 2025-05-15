import ApiClient from "./apiClient.js";

class PersonalityApi {
	async getAllPersonalityTypes() {
		return await ApiClient.get("/api/personality");
	}

	async getAllPersonalityTraits() {
		return await ApiClient.get("/api/trait");
	}

	async getPersonalityByCode(code) {
		return await ApiClient.get(`/api/personality/code/${code}`);
	}
}

const personalityApi = new PersonalityApi();
export default personalityApi;
