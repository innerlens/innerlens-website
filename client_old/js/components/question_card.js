export class QuestionCard {
	constructor(index, question, options, onSelectCallback = null) {
		this.index = index;
		this.question = question;
		this.options = [...options];
		this.selectedOption = null;
		this.onSelectCallback = onSelectCallback;
	}

	handleSelect(event) {
		if (event.target.tagName === "INPUT" && event.target.type === "radio") {
			this.selectedOption = event.target.value;
			this.onSelectCallback?.(this.index, this.selectedOption);
		}
	}

	render(parentId) {
		const optionsHtml = this.options
			.map(
				(option, i) => `
            <li class="option">
                <label class="option" for="option-${this.index}-${i}">
                    <input type="radio" id="option-${this.index}-${i}" name="${this.index}" value="${option.statement}">
                    ${option.statement}
                </label>
            </li>
        `
			)
			.join("");

		const liElement = document.createElement("li");
		liElement.classList.add("question-card");
		liElement.id = `question-${this.index}`;

		liElement.innerHTML = `
            <p>${this.question}</p>
            <ul class="options">
                ${optionsHtml}
            </ul>
        `;

		const parent = document.getElementById(parentId);
		parent.appendChild(liElement);
		liElement.addEventListener("click", this.handleSelect.bind(this));
	}
}
