const addphoto = require("./../images/upload.jpg");
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZXplcXVpZWw5MyIsImEiOiJja3U0aTAyc2gwaGg1MnBvNmhyemJzbDc2In0.VfvIXjWgL8_dqs1ZKlQorA";
let map;
import { state } from "../state";
import { Router } from "@vaadin/router";
import Swal from "sweetalert2";

const editData = { name: "", lat: "", lng: "", location: "", photoURL: "" };
export class EditPetsInit extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = /*html*/ `
      
      <header-el></header-el>
        <div class="edit-container">
          <h1 class="tittle-mascotas">Editar reporte de mascota</h1>
          <h2 class="editpet-text">Ingresá la siguiente información para realizar el reporte de la mascota</h2>
          <div class="edit-form1-container">
            <form class="form-name" id="form1">
              <label class="label-text" for="nombre">Nombre</label><br>
             <input class="input-report" type="text" name="name" />
            </form>
          </div>

          <div class="imageupload-container">
            <label class="uploading">Agregar foto</label>
            <img class="foto-input" src=${addphoto}>
          </div>

            <form class="search-form">
              <label >1-Buscar por ubicación (Ciudad, Provincia)</label>
              <input class="input-report" name="q" type="search">
              <button-el>Buscar</button-el>
              <label >2-Seleccionar un punto en el mapa</label>
                  <div class="map" id='map' style='width: 300px; height: 200px;'></div>
                  
                  </form>
                  <button-el id="editbutton">Editar Mascota</button-el>

                  <button-el color="#EB6372" id="deletebutton">Eliminar Mascota</button-el>
        </div>
                  `;
    const imgDropzone = this.querySelector(".foto-input") as HTMLImageElement;
    let pictureFile;

    const myDropzone = new Dropzone(".foto-input", {
      url: "/falsa",
      autoProcessQueue: false,
    });

    myDropzone.on("thumbnail", function (file) {
      // usando este evento pueden acceder al dataURL directamente
      pictureFile = file.dataURL;
      imgDropzone.src = pictureFile;
      editData.photoURL = pictureFile;
    });
    this.initMap();
    this.buscarDir();

    const formName = this.querySelector(".form-name") as HTMLFormElement | null;
    formName?.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const nameInput = formName.elements.namedItem("name") as HTMLInputElement;
      editData.name = nameInput.value;
      if (
        editData.name == "" ||
        editData.photoURL == "" ||
        editData.location == ""
      ) {
        Swal.fire({
          icon: "error",
          title: "DATOS INCOMPLETOS",
          text: "Completa todos los datos para poder Continuar",
        });
        console.log("faltan datos");
      } else {
        state.editPets(state.petEdit.petId, editData).then(() => {
          Router.go("/mismascotas");
        });
      }
    });

    const button1 = document.getElementById("editbutton");
    button1?.addEventListener("click", (e) => {
      e.preventDefault();
      if (formName) {
        formName.requestSubmit();
      }
    });
    const button2 = document.getElementById("deletebutton");
    button2?.addEventListener("click", (e) => {
      e.preventDefault();
      if (formName) {
        state
          .deletePet(state.petEdit.photoURL, state.petEdit.petId)
          .then(() => {
            Router.go("/mismascotas");
          });
      }
    });
  }

  initMap() {
    const mapContainer: any = this.querySelector(".map");
    // const currentState = state.getState();
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.381775, -34.603851], // Coordenadas del Obelisco en Buenos Aires long-lat
      zoom: 8,
      maxBounds: [
        [-75, -55], // Esquina suroeste de Argentina
        [-53, -20], // Esquina noreste de Argentina
      ],
    });
  }
  initSearchForm(query: string) {
    // Cambiar el cursor a 'wait' mientras se realiza la búsqueda
    map.getCanvas().style.cursor = "wait";

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&country=AR`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          const placeName = data.features[0].place_name;
          const nameUbicacionPet = placeName.split(" ").slice(0, 4).join(" ");
          const nameUbicacion = nameUbicacionPet.split(",").join("");

          editData.lng = longitude;
          editData.lat = latitude;
          editData.location = nameUbicacion;

          // Centrar el mapa en la ubicación buscada
          map.flyTo({ center: [longitude, latitude], zoom: 15 });

          // Cambiar el cursor a 'crosshair' cuando se está en modo de selección en el mapa
          map.getCanvas().style.cursor = "crosshair";

          // Eliminar marcadores existentes (si los hay)
          if (map.getLayer("marker")) {
            map.removeLayer("marker");
            map.removeSource("marker");
          }

          // Cargar la imagen de una flecha o cualquier otro icono personalizado
          map.loadImage(
            "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
            (error, image) => {
              if (error) throw error;

              // Asegúrate de agregar la imagen solo una vez
              if (!map.hasImage("custom-marker")) {
                map.addImage("custom-marker", image);
              }

              // Agregar el marcador en el punto de la ubicación buscada
              map.addSource("marker", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude], // Coordenadas de la ubicación buscada
                      },
                    },
                  ],
                },
              });

              // Añadir la capa del marcador con el icono personalizado
              map.addLayer({
                id: "marker",
                type: "symbol",
                source: "marker",
                layout: {
                  "icon-image": "custom-marker", // Usamos la imagen cargada
                  "icon-size": 1.0, // Tamaño del marcador (puedes ajustarlo)
                  "icon-anchor": "bottom", // Ancla el marcador en la parte inferior
                },
              });
            }
          );

          // Evento para cambiar la ubicación del marcador al hacer clic en el mapa
          map.on("click", (e) => {
            const { lng, lat } = e.lngLat;

            editData.lng = lng;
            editData.lat = lat;
            editData.location = nameUbicacion;

            // Actualizar el marcador a la nueva ubicación seleccionada
            map.getSource("marker").setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                  },
                },
              ],
            });
          });

          // Restablecer el cursor después de la búsqueda
          map.getCanvas().style.cursor = "";
        } else {
          console.error("No se encontraron resultados en Argentina.");
          // Restablecer el cursor si no hay resultados
          map.getCanvas().style.cursor = "";
        }
      })
      .catch((error) => {
        console.error("Error al realizar la búsqueda:", error);
        // Restablecer el cursor en caso de error
        map.getCanvas().style.cursor = "";
      });
  }
  buscarDir() {
    const form = this.querySelector(".search-form") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target instanceof HTMLFormElement) {
        const query = e.target.q.value;
        if (query.trim() !== "") {
          this.initSearchForm(query);
        }
      }
    });
  }
}

customElements.define("edit-pets-page", EditPetsInit);
