export const HeaderContent = {
  heading: "innerlens",
  navLinks: [
    { href: "#home", text: "Home" },
    { href: "#my-personality", text: "My Personality" },
    { href: "#personality-types", text: "Personality Types" },
  ],

  render() {
    const navHtml = this.navLinks
      .map(
        (link) => `
            <li class="nav-item">
                <a class="nav-link" href="${link.href}">${link.text}</a>
            </li>
        `,
      )
      .join("");

    const htmlContent = `
            <h1 id="title">${this.heading}</h1>
            <nav id="header-nav">
                <ul id="header-ul">${navHtml}</ul>
            </nav>
        `;

    document.querySelector("header").innerHTML = htmlContent;
  },
};
