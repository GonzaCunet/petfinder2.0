import { state } from "../state";
import { Router } from "@vaadin/router";
export class SignUpInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = /*html*/ `
      <header-el></header-el>
      <div class="main-ingresar">
          <div class="text-container">
              <h1 class="signuptittle">Registrarse</h1>
              <h3>ingresá los siguientes datos para realizar el registro</h3>
          </div>
          <form class="formulario-signup">
          <label class="label-text" for="email">EMAIL</label>
          <input class="input" type="text" name="Email" />
          <label class="label-text" for="name">Nombre</label>
          <input class="input" type="text" name="name" />
          <label class="label-text" for="contraseña">CONTRASEÑA</label>
          <input class="input" type="password" name="contraseña" />
          <label class="label-text" for="contraseña">CONFIRMAR CONTRASEÑA</label>
          <input class="input" type="password" name="confirmarcontraseña" />
             <h3>¿ya tenes una cuenta?</h3><a class="text-link" href="">inicia sesión</a>
          <div class="button-container">
              <button-el>Siguiente</button-el>
          </div></form>
       
      </div>
      
      `;

    const form = this.querySelector(".formulario-signup");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const email = target?.elements["Email"].value;
      const name = target?.elements["name"].value;
      const password = target?.elements["contraseña"].value;
      const passwordcheck = target?.elements["confirmarcontraseña"].value;
      if (password != passwordcheck) {
        console.log("el password no coincide");
      } else if (
        email == "" ||
        password == "" ||
        passwordcheck == "" ||
        name == ""
      ) {
        console.log(
          "debe completar todos los campos correctamente para poder continuar"
        );
      } else {
        state.userSignUp(email, password, name).then(() => {
          state.logIn(email, password).then((res) => {
            state.data.token = res.token;
            state.data.mail = email;
            Router.go("/");
          });
        });
      }
    });
  }
}

customElements.define("signup-page", SignUpInit);
