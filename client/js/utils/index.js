import AuthService from "../logic/auth_service";

export function withAuthorisationCheck(methodName, ...args) {
	const authToken = AuthService.getAuthHeader()["Authorization"];

	if (!authToken) {
		console.error(`Authentication failed for static method: ${methodName}`);
		return { error: "Unauthorized" };
	}
	return undefined; // Signal to proceed with the original method
}

export function applyAuthChecktOMethods(target, authCheckFn) {
	for (const key of Object.getOwnPropertyNames(target)) {
		if (typeof target[key] === "function" && target.hasOwnProperty(key)) {
			const originalMethod = target[key];
			target[key] = function (...args) {
				const authResult = authCheckFn(key, ...args);
				if (authResult && authResult.error) {
					return authResult;
				}
				return originalMethod.apply(this, args);
			};
		}
	}
}
