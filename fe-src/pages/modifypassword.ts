import { Router } from "@vaadin/router";
import { state } from "../state";
import Swal from "sweetalert2";

export class ModifyPasswordInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = /*html*/ `
    <header-el></header-el>
      <div class="main-modifypass">

            <h1 class="h1-password">Elegí una nueva clave</h1>
        
          <form class="formulario-pass">
            <label class="label-text" for="password" name="password">Password</label>
            <input class="input-ingresar" type="password" name="password" />
          <label class="label-text" for="confirmPassword">Confirma tu nueva clave</label>
            <input class="input-ingresar" type="password" name="confirmPassword" />
        <button-el>Guardar</button-el>
        </form>
       
      </div>
    `;

    //TODO  cambiar el password. local storage
    const form = this.querySelector(".formulario-pass");
    form?.addEventListener("submit", (e) => {
      const target = e.target as HTMLFormElement;
      const password = target?.elements["password"].value;
      const confirmPassword = target?.elements["confirmPassword"].value;
      if (password != confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password invalido",
          text: "Ambas contraseñas deben coincidir",
        });
      } else {
        state.editPassword(password).then(() => {
          Router.go("/misdatos");
        });
      }
    });
  }
}

customElements.define("modifypassword-page", ModifyPasswordInit);
