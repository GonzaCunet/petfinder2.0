import { Router } from "@vaadin/router";
import { state } from "../state";
import Swal from "sweetalert2";

const puerta = require("./../images/puertaimg.svg");
export class IngresarInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = /*html*/ `
    <header-el></header-el>
    <div class="main-ingresar">
        <img class="imagen" src=${puerta}>
        <div class="text-container">
            <h1>Iniciar Sesión</h1>
            <h3>ingresá los datos para iniciar sesión</h3>
        </div>
          <form class="formulario">
            <label class="label-text" for="email" name="email">EMAIL</label>
            <input class="input-ingresar" type="text" name="Email" />
          <label class="label-text" for="pass">CONTRASEÑA</label>
            <input class="input-ingresar" type="password" name="pass" />
            <a class="text-link" href="">olvidé mi contraseña</a>
          
        <button-el>Acceder</button-el>
        </form>
        <p class="text-form">Aún no tenes cuenta? <a href="/signup" class="text-link" id="registro" >Registrate.</a></p>
        </div>
    `;
    const form = this.querySelector(".formulario");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene el comportamiento por defecto del formulario
      const target = e.target as HTMLFormElement;
      const email = target?.elements["Email"].value;
      const pass = target?.elements["pass"].value;

      try {
        const res = await state.logIn(email, pass);

        // Verificamos si el login fue exitoso (por ejemplo, si hay un token)
        if (res && res.token) {
          state.data.token = res.token;
          state.data.mail = email;
          Router.go("/"); // Redirige solo si el login es válido
        } else {
          // Muestra un mensaje de error si el login falla
          Swal.fire({
            icon: "error",
            title: "DATOS INCORRECTOS",
            text: "Asegurate de completar correctamente tus datos",
          });
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
    });
  }
}

customElements.define("ingresar-page", IngresarInit);
