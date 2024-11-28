import { Router } from "@vaadin/router";
import { state } from "../state";
export class MisDatosInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = /*html*/ `
    <header-el></header-el>
    <div class="main-ingresar">
        
        <div class="misdatos-text-container">
            <h1 class="misDatosTittle">Datos Personales</h1>
        </div>
          
        <button-el class="misDatos">mis datos personales</button-el>
        <button-el class="password">modificar contraseña</button-el>
        </form>
        </div>
    `;
    const button1 = this.querySelector(".misDatos");
    button1?.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/datospersonales");
    });
    const button2 = this.querySelector(".password");
    button2?.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/modifypassword");
    });
  }
  // TODO el header si no tenes el token te tiene que llevar a registrarte. faltan las páginas de modificar datos personales y password
}

customElements.define("misdatos-page", MisDatosInit);
