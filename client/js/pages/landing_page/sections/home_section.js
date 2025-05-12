export const HomeSection = {
    isUserSignedIn: true,

    render() {

        const buttonText = this.isUserSignedIn ? "Start Personality Test" : "Sign In to Take Test";

        const article = document.createElement('article');
        article.id = "home";

        article.innerHTML = `
            <p id="slogan"><em>Your personality</em>,<br>decoded and reflected<br>through a <em>clearer lens</em>.</p>
        `;

        const button = document.createElement('button');
        button.classList.add('primary-button');
        button.innerText = buttonText;

        article.appendChild(button);

        button.removeEventListener('click', this.onButtonClick);
        button.addEventListener('click', this.onButtonClick.bind(this));
        
        const parent = document.getElementById('landing-page');
        parent.appendChild(article);
    },

    onButtonClick() {
        if (this.isUserSignedIn) {
            window.location.href = "/test";
        } else {
            window.location.href = "/sign-in";  
        }
    }
}