import { state } from "../state";
import { Resend } from "resend";
const cruz = require("./../images/close.svg");

export class HomeMascotasInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    let mascotasReportadas: any = state.pets;

    this.innerHTML = `
        <header-el></header-el>
    <div class="main-mascotas">
      <h1 class="tittle-mascotas">Mascotas perdidas cerca</h1>
      ${
        mascotasReportadas.length == 0
          ? "<h2>no hay mascotas cerca</h2>"
          : `${mascotasReportadas
              .map((e: any) => {
                return `
                <cards-el id="id${e.id}" name="${e.name}" location="${e.lastLocation}" photoURL="${e.photoURL}" buttonColor="#EB6372" buttonText="reportar"></cards-el>
                <div id="report-div-${e.id}" class="report-div-close">
                     <img id="close${e.id}" class="crucecita" src=${cruz}></img>
                  <form id="form${e.id}" class="formulario">
                   <label class="label-text-mascotas" for="name" name="name">Nombre</label>
                   <input class="input-ingresar" type="text" name="name" />
                   <label class="label-text-mascotas" for="phone">Teléfono</label>
                   <input class="input-ingresar" type="text" name="phone" />
                   <label class="label-text-mascotas" for="text">¿Dónde lo viste?</label>
                   <textarea class="textarea-ingresar" type="text" name="textarea" rows="4" cols="50" ></textarea>
                   <button-el color="#00A884">Enviar información</button-el>
                   </form>
                </div>`;
              })
              .join("")}`
      }
    </div>
    `;

    // Agregar eventos a cada tarjeta
    mascotasReportadas.forEach((pet) => {
      const reportMascotasEl = this.querySelector(`#id${pet.id}`);
      const reportDiv = this.querySelector(`#report-div-${pet.id}`);
      const closeReport = this.querySelector(`#close${pet.id}`);
      closeReport?.addEventListener("click", (e) => {
        e.preventDefault();
        reportDiv?.classList.replace("report-div-open", "report-div-close");
      });
      // Evento para el botón "reportar"
      reportMascotasEl?.addEventListener("click", (e) => {
        e.preventDefault();
        if (reportDiv?.classList.contains("report-div-close")) {
          reportDiv.classList.replace("report-div-close", "report-div-open");
        } else {
          reportDiv?.classList.replace("report-div-open", "report-div-close");
        }
      });
      const form = this.querySelector(`#form${pet.id}`);
      console.log(form);
      form?.addEventListener("submit", (e) => {
        const target = e.target as HTMLFormElement;
        const name = target?.elements["name"].value;
        const phone = target?.elements["phone"].value;
        const textarea = target?.elements["textarea"].value;
        const petInfo = { name, phone, textarea };
        console.log(petInfo);
        state.sendPetInfo(pet.id, petInfo);
      });
    });
  }
}

customElements.define("home-mascotas", HomeMascotasInit);
