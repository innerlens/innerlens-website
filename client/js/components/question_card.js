class QuestionCard {
    constructor(index, question, options, onSelectCallback=null) {
        this.index = index;
        this.question = question;
        this.options = [...options];
        this.selectedOption = null;
        this.onSelectCallback = onSelectCallback;
    }

    handleSelect(event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
            this.selectedOption = event.target.value;
            this.onSelectCallback?.(this.index, this.selectedOption);
        }
    }

    render(parentId) {
        const optionsHtml = this.options
        .map((option, i) => `
            <label class="option" for="option-${this.index}-${i}">
                <input type="radio" id="option-${this.index}-${i} name="${this.index}" value="${option}">
                ${option}
            </label>
        `).join('');

        const htmlContent = `
            <li class="question-card">
                <fieldset>
                    <legend class="question">${question}</legend>
                    ${optionsHtml}
                </fieldset>
            </li>
        `
        
        const parent = document.getElementById(parentId);
        parent.insertAdjacentElement('beforeend', htmlContent);

        const questionElement = document.getElementById(`question-${this.index}`);
        questionElement.addEventListener('click', this.handleSelect.bind(this));
    }
}