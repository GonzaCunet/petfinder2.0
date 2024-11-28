export class Button extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const buttonEl = document.createElement("button");
    const buttonColor: any = this.getAttribute("color");

    style.innerHTML = /*css*/ `
    .root{
      width: 270px;
      height: 50px;
      border-style: none;
      border-radius: 10px;          
      background-color:#5A8FEC;
      font-size: 16px;
      font-family: 'Odibee Sans', sans-serif;
      color: white;
    }`;

    buttonEl.className = "root";
    buttonEl.textContent = this.textContent;
    buttonEl.addEventListener("click", (event) => {
      event.preventDefault();
      const form = this.closest("form"); // Buscar el formulario más cercano al botón
      if (form) {
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        ); // Disparar manualmente el evento de envío del formulario
      }
    });

    buttonEl.style.backgroundColor = buttonColor;
    shadow.appendChild(buttonEl);
    shadow.appendChild(style);
  }
}

customElements.define("button-el", Button);
