import "./router.ts";
import "./components/header.ts";
import "./components/button.ts";
import "./components/cards.ts";
import "./pages/home.ts";
import "./pages/home-mascotas.ts";
import "./pages/ingresar.ts";
import "./pages/sign-up.ts";
import "./pages/reportpets.ts";
import "./pages/mismascotas.ts";
import "./pages/editPets.ts";
import "./pages/misDatos.ts";
import "./pages/modifypassword.ts";
import "./pages/datosPersonales.ts";
import { state } from "./state.ts";

function init() {
  state.init();
}
init();
