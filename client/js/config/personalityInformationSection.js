import AppEvent from "../enums/appEvent.js";

export const eventsToRender = new Set([
	AppEvent.USER_SIGNED_IN,
	AppEvent.USER_SIGNED_OUT,
	AppEvent.PERSONALITY_TRAITS_LOADED,
	AppEvent.PERSONALITY_TYPES_LOADED,
]);
