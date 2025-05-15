import { jest } from '@jest/globals';
import QuestionCard from '../../../js/config/questionCard.js';

const mockCreateElement = jest.fn((tag, { id, className, text, attributes }) => {
	const el = document.createElement(tag);
	if (id) el.id = id;
	if (className) el.className = className;
	if (text) el.textContent = text;
	if (attributes) {
		Object.entries(attributes).forEach(([attr, val]) => el.setAttribute(attr, val));
	}
	return el;
});

jest.unstable_mockModule('../../../js/util/dom.js', () => ({
	createElement: mockCreateElement,
}));

const { createElement } = await import('../../../js/util/dom.js');

describe('QuestionCard component', () => {
	const mockOptions = [
		{ trait_id: 'trait1', statement: 'Option 1' },
		{ trait_id: 'trait2', statement: 'Option 2' },
	];
	const mockCallback = jest.fn();

	beforeEach(() => {
		document.body.innerHTML = `<ul id="question-list"></ul>`;
		mockCreateElement.mockClear();
		mockCallback.mockClear();
	});

	test('renders question and options correctly', () => {
		const questionCard = new QuestionCard('q1', 'What is your choice?', mockOptions, mockCallback);
		questionCard.render();

		const questionEl = document.getElementById('question-q1');
		expect(questionEl).not.toBeNull();
		expect(questionEl.querySelector('p').textContent).toBe('What is your choice?');

		const options = questionEl.querySelectorAll('input[type="radio"]');
		expect(options).toHaveLength(2);
		expect(options[0].value).toBe('Option 1');
		expect(options[1].value).toBe('Option 2');
	});

	test('handles option selection correctly', () => {
		const questionCard = new QuestionCard('q1', 'Choose:', mockOptions, mockCallback);
		questionCard.render();

		const input = document.getElementById('q1-trait1');
		input.click();

		expect(mockCallback).toHaveBeenCalledWith('q1', 'q1-trait1');
	});
});