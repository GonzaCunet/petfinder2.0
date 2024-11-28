import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/homemascotas", component: "home-mascotas" },
  { path: "/ingresar", component: "ingresar-page" },
  { path: "/signup", component: "signup-page" },
  { path: "/reportpets", component: "report-page" },
  { path: "/mismascotas", component: "mismascotas-page" },
  { path: "/editPets", component: "edit-pets-page" },
  { path: "/misdatos", component: "misdatos-page" },
  { path: "/datospersonales", component: "datospersonales-page" },
  { path: "/modifypassword", component: "modifypassword-page" },
]);
