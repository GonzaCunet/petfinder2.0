import { Router } from "@vaadin/router";
import { state } from "../state";

export class DatosPersonalesInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = /*html*/ `
    <header-el></header-el>
    <div class="main-ingresar">

            <h1>Datos Personales</h1>
        </div>
          <form class="formulario">
            <label class="label-text" for="name" name="name">Nombre</label>
            <input class="input-ingresar" type="text" name="name" />
          <label class="label-text" for="localidad">Localidad</label>
            <input class="input-ingresar" type="localidad" name="localidad" />
        <button-el>Guardar</button-el>
        </form>
        </div>
    `;

    //TODO cambiar el password en el front. local storage. mail de confirmación. hacer la page mascotas avistadas
    const form = this.querySelector(".formulario");
    form?.addEventListener("submit", (e) => {
      const target = e.target as HTMLFormElement;
      const name = target?.elements["name"].value;
      const location = target?.elements["localidad"].value;
      state.editUser(name, location).then(() => {
        Router.go("/misdatos");
      });
    });
  }
}

customElements.define("datospersonales-page", DatosPersonalesInit);
