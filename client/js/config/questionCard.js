import { clearElement, createElement } from "../util/dom.js";

class QuestionCard {
	constructor(
		questionId,
		question,
		options,
		answerId,
		onSelectCallback = null
	) {
		this.parentId = "question-list";
		this.questionId = questionId;
		this.question = question;
		this.options = [...options];
		this.answerId = answerId;
		this.selectedOption = null;
		this.onSelectCallback = onSelectCallback;
	}

	handleSelect(event) {
		if (event.target.tagName === "INPUT" && event.target.type === "radio") {
			this.selectedOption = event.target;
			this.onSelectCallback?.(this.questionId, this.selectedOption.id);
		}
	}

	render() {
		const ul = createElement("ul", { className: "options" });

		this.options.forEach((option) => {
			const chosen = this.answerId == option.trait_id;

			const inputId = `${this.questionId}-${option.trait_id}`;

			const input = createElement("input", {
				attributes: {
					type: "radio",
					id: inputId,
					name: `${this.questionId}`,
					value: option.statement,
				},
			});

			if (chosen) {
				input.checked = true;
			}

			const label = createElement("label", {
				className: "option",
				attributes: {
					for: inputId,
				},
			});

			label.appendChild(input);
			label.appendChild(document.createTextNode(option.statement));

			const li = createElement("li", {
				className: "option",
			});

			li.appendChild(label);
			ul.appendChild(li);
		});

		const li = createElement("li", {
			className: "question-card",
			id: `question-${this.questionId}`,
		});

		const p = createElement("p", { text: this.question });

		li.append(p, ul);

		const parent = document.getElementById(this.parentId);
		parent.appendChild(li);
		li.addEventListener("click", this.handleSelect.bind(this));
	}
}

export default QuestionCard;
