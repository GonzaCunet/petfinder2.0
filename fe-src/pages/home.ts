const homephoto = require("./../images/homephoto.svg");
import { Router } from "@vaadin/router";
import { state } from "../state";
export class HomeInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header-el></header-el>
    <div class="main-home">
      <img class="imagen" src=${homephoto} alt="">
      <h1 class="title">Pet Finder App</h1>
      <h2 class="text">Encontra y reportá<br> mascotas perdidas<br> cerca de tu ubicación</h2>
      <button-el class="location">Dar mi ubicación actual</button-el>
      ${
        state.data.token == ""
          ? `<button-el class="howWorks" color="#00A884">Ingresá</button-el>`
          : ``
      }
      
    </div>
    
    `;
    // condicion ? "verdadero" : "falso";
    const buttonElement = document.querySelector(".location");
    // Verificamos si la geolocalización está disponible
    buttonElement?.addEventListener("click", (e) => {
      // Verificamos si la geolocalización está disponible
      if (navigator.geolocation) {
        // Pedimos la ubicación actual
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Si se obtiene la ubicación, la mostramos
            const latitude = position.coords.latitude; // Latitud
            const longitude = position.coords.longitude; // Longitud
            state.data.lat = latitude;
            state.data.lng = longitude;
            state.getNearPets(state.data.lat, state.data.lng).then((res) => {
              state.pets = res;
              Router.go("/homemascotas");
            });
          },
          (error) => {
            // Manejo de errores
            console.error("Error al obtener la ubicación:", error);
          }
        );
      } else {
        console.log("La geolocalización no está soportada en este navegador.");
      }
    });
    const buttonEl2 = document.querySelector(".howWorks");
    buttonEl2?.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/ingresar");
    });
  }
}

customElements.define("home-page", HomeInit);
