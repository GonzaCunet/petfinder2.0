import { state } from "../state";
import { Router } from "@vaadin/router";

const mapslogo = require("./../images/mapslogo.svg");
const menu = require("./../images/menu.svg");

class Header extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const header = document.createElement("div");

    header.className = "header-el";
    style.innerHTML = `      
             .header-el {
                margin:0 auto;
                background-color: #26302E;
                height: 8vh;
                display:flex;
                flex-direction:row;
                justify-content: space-between;
                align-items:center;
                padding:0 10px;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                }

              .logoimagen{
              width:30px;
              height:30px;}

              .burger-menu-img{
              width:30px;
              height:30px;}

              .burger-div-open{
                margin:0 auto;
                position: absolute;
                background-color: black;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 5;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 30px;
              
              }
              .burger-div-close{
              display:none;
              visibility: hidden;
              }

              .burger-text{
              font-size: 24px;
              line-height: 36px;
              color:white;
              text-decoration: none;
              }
              .burger-text:hover{
              cursor:pointer;
              color:aqua; }

             .cerrar-sesion {
                color:white;
               font-size: 22px;
               
    }
    
              .cerrar-sesion:hover {
               cursor: pointer;
               color: aqua;
    }
             `;
    header.innerHTML = `
                <img class="logoimagen" src=${mapslogo} href="/" alt="">
                <img class="burger-menu-img" src=${menu} alt="">
                <div class="burger-div-close">
                  <img class="burger-close" src=${menu}alt="">
                  <a class="burger-text" href="misdatos"> Mis datos</a>
                  <a class="burger-text" href="mismascotas"> Mis mascotas reportadas</a>
                  ${
                    state.data.token == ""
                      ? `<a class="burger-text" href="/signup"> Reportar mascota</a>`
                      : `<a class="burger-text" href="/reportpets"> Reportar mascota</a>`
                  }
                   
                  ${
                    state.data.mail == ""
                      ? ``
                      : `<h2 class="burger-text">${state.data.mail}</h2>
                        <a class="cerrar-sesion">CERRAR SESIÓN</a> `
                  }
                  
                </div>
            
             `;

    shadow.appendChild(header);
    shadow.appendChild(style);
    const logo = shadow.querySelector(".logoimagen");
    const logOut = shadow.querySelector(".cerrar-sesion");
    const burgerMenu = shadow.querySelector(".burger-menu-img");
    const burgerDiv = shadow.querySelector(".burger-div-close");
    const burgerclose = shadow.querySelector(".burger-close");

    logo?.addEventListener("click", () => {
      Router.go("/");
    });
    logOut?.addEventListener("click", () => {
      console.log("holaa");
      burgerDiv?.classList.replace("burger-div-close", "burger-div-open");
      location.reload();
      state.logout();
      Router.go("/");
    });

    burgerclose?.addEventListener("click", () => {
      burgerDiv?.classList.replace("burger-div-open", "burger-div-close");
    });
    burgerMenu?.addEventListener("click", () => {
      burgerDiv?.classList.replace("burger-div-close", "burger-div-open");
    });
  }
}

customElements.define("header-el", Header);
