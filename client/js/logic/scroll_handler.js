export const ScrollHandler = {
	navLi: null,

	addHighlighting() {
		this.navLi = document.querySelectorAll("nav ul li a");

		window.addEventListener("scroll", this.onScroll.bind(this));
	},

	onScroll() {
		let current = "";

		const sections = document.querySelectorAll("article");
		sections.forEach((section) => {
			const sectionTop = section.getBoundingClientRect().top;

			if (pageYOffset >= sectionTop) {
				current = section.id;
			}
		});

		this.navLi.forEach((li) => {
			li.classList.remove("active");
			if (li.classList.contains(current)) {
				li.classList.add("active");
			}
		});
	},
};
