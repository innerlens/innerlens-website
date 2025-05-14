export function clearElement(element) {
	element?.replaceChildren();
}

export function createElement(
	tag,
	{ className = "", id = "", text = "", attributes = {}, events = {} } = {}
) {
	const element = document.createElement(tag);
	if (className) element.className = className;
	if (id) element.id = id;
	if (text) element.textContent = text;

	for (const [attr, val] of Object.entries(attributes)) {
		element.setAttribute(attr, val);
	}

	for (const [event, handler] of Object.entries(events)) {
		element.addEventListener(event, handler);
	}

	return element;
}

export function setupBaseLayout() {
	clearElement(document.body);
	document.body.appendChild(document.createElement("header"));
	document.body.appendChild(document.createElement("main"));
}

export function removeElementWithId(id) {
	document.getElementById(id)?.remove();
}

export function clearElementWithId(id) {
	clearElement(document.getElementById(id));
}
