import { Navigation } from "./navigation.js";

export const HeaderContent = {
    heading: "innerlens",

    render() {

        const title = document.createElement('h1');
        title.id = "title";

        title.innerText = this.heading

        const parent = document.querySelector('header');
        parent.appendChild(title);

        Navigation.render();
    }
}