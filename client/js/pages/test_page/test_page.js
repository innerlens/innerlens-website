import { QuestionCard } from "../../components/question_card.js";

export const TestPage = {
    questions: [],
    cards: [],

    async loadQuestions() {
        const res = await fetch('../../assets/data/test/questions.json');
        this.questions = await res.json();
    },

    async render() {
        console.log('rendering tests');
        await this.loadQuestions();

        const questionListId = "question-list";

        const testPage = document.createElement('section');
        testPage.id = "test-page";

        testPage.innerHTML = `
            <h1 id="test-page-heading">Personality Test</h1>
            <ul id="${questionListId}"></ul>
        `;

        const parent = document.querySelector('main');
        parent.innerHTML = '';
        parent.appendChild(testPage);

        this.cards = this.questions.map((data, index) => {
            const card = new QuestionCard(index, data.question, data.options, this.handleSelect.bind(this));
            card.render(questionListId);
            return card;
        })
    },

    handleSelect(index, selectedOption) {
        console.log(`Q${index + 1}: ${selectedOption}`);
    }
}