import { state } from "../state";
import { Router } from "@vaadin/router";
export class MisMascotas extends HTMLElement {
  async connectedCallback() {
    await state.showMyPetsCreated();
    this.render();
  }
  render() {
    let buscarMascotas: any = state.myPets;
    this.innerHTML = `
    
    <header-el></header-el>
    <div class="main-mis-mascotas">
      <h1 class="tittle-mis-mascotas">Mis mascotas reportadas</h1>
      ${
        buscarMascotas.length == 0
          ? `<h1>no tenes mascotas reportadas</h1>`
          : `${buscarMascotas
              .map((e) => {
                return `<cards-el id="id${e.id}" name="${e.name}" location="${e.lastLocation}"  photoURL="${e.photoURL}" buttonColor="#00BFFF" buttonText="editar"></cards-el>
                `;
              })
              .join("")}`
      }
          </div>
              `;
    buscarMascotas.forEach((pet) => {
      const editMascotasEl = this.querySelector(`#id${pet.id}`);
      editMascotasEl?.addEventListener("click", (e) => {
        state.petEdit.petId = pet.id;
        state.petEdit.photoURL = pet.photoURL;
        Router.go("/editpets");
      });
    });
  }
}
customElements.define("mismascotas-page", MisMascotas);

// return `<cards-el name="${e.name}" location="${e.lastLocation}"  photoURL="${e.photoURL}"></cards-el>`;
