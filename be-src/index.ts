import "./dev";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import {
  createUsers,
  getUserByPk,
  getUsers,
  modifyUserData,
} from "./controller/users";
import {
  deletePet,
  deletePetAlgolia,
  deletePetPhoto,
  getPetsCreated,
  modifyPetData,
  searchNearPets,
  updateAlgoliaLocation,
} from "./controller/pets";

import {
  authMiddleware,
  authToken,
  authUsers,
  getAuth,
  patchAuth,
} from "./controller/auth";
import { cloudinary } from "./lib/cloudinary";
import {
  createPets,
  cloudinaryPhotoUpload,
  saveAlgoliaData,
} from "./controller/pets";
import { findMail, sendMail } from "./controller/mail";
import { Auth, User, Pets } from "./models/models";

const app = express();
app.use(cors());
const port = 3000;

app.use(
  express.json({
    limit: "50mb",
  })
);

app.post("/sendmail", async (req, res) => {
  const { petId, phone, name, textarea } = req.body;
  try {
    const subject = await findMail(petId);
    const send = await sendMail(subject, name, phone, textarea);

    res.status(200).json({ message: "email ya enviado" });
  } catch (error) {
    console.log(error, "error al enviar el mail");
    res.status(400).json(error.message);
  }
});

app.post("/pets", authMiddleware, async (req, res) => {
  const { name, lastLocation, photoURL, lat, lng } = req.body;
  const UserId = (req as any)._user.id;
  console.log({ req: (req as any)._user });
  console.log("Request body:", req.body);
  console.log("User extraído del token:", UserId);
  try {
    const createPhoto = await cloudinaryPhotoUpload(photoURL);
    console.log("Foto subida a Cloudinary:", createPhoto);
    const returnpet = await createPets(
      name,
      lastLocation,
      createPhoto,
      lat,
      lng,
      UserId
    );
    const petId = returnpet.get("id");
    const algoliaData = await saveAlgoliaData(petId, lat, lng);

    res.json({
      message: "mascota creada",
      result: returnpet,
      algoliaData: algoliaData,
    });
  } catch (error) {
    console.log(error, "error al crear la mascota");
    res.status(400).json({ error: error.message || "Fallo general" });
  }
});

app.get("/auth", async (req, res) => {
  // const userId = await User.findAll({ include: });
  const { authId } = req.body;
  const respuesta = await Auth.findAll();
  res.json({ respuesta });
});

app.post("/auth", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const respuestaAuth = await authUsers(email, password);
    const respuestaUser = await createUsers(
      name,
      respuestaAuth.get("id") as string
    );

    res.json({ message: "usuario creado", respuestaUser: respuestaUser });
  } catch (error) {
    console.log(error, "error al crear el perfil");
    res.status(400).json(error.message);
  }
});
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;

  try {
    const respuesta = await authToken(email, password);
    res.status(201).json({ token: respuesta });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("/user", authMiddleware, async (req, res) => {
  const user_id = (req as any)._user.id;
  console.log((req as any)._user);
  const respuesta = await getUserByPk(user_id);
  res.json(respuesta);
});
app.get("/test", async (req, res) => {
  const respuesta = await Auth.findAll();
  res.json(respuesta);
});
app.get("/petscreated", authMiddleware, async (req, res) => {
  const UserId = (req as any)._user.id;
  try {
    const buscarMascotasCreadas = await getPetsCreated(UserId);
    res.status(200).json(buscarMascotasCreadas);
  } catch (error) {
    console.log(error, "error buscando las mascotas creadas");
    res.status(400).json(error.message);
  }
});

app.delete("/pet", authMiddleware, async (req, res) => {
  const userId = (req as any)._user.id;
  try {
    const { photoURL, id } = req.body;
    const deletePhoto = await deletePetPhoto(photoURL);
    const deleteAlgolia = await deletePetAlgolia(id);
    const deletePetSequelize = await deletePet(id);

    res.status(200).json("mascota eliminada correctamente");
  } catch (error) {
    console.log(error, "error al eliminar la mascota");
    res.status(400).json(error.message);
  }
});

app.patch("/pet", authMiddleware, async (req, res) => {
  try {
    const { petId, name, lat, lng, photoURL, lastLocation } = req.body;
    const newPhoto = await cloudinaryPhotoUpload(photoURL);
    await updateAlgoliaLocation(petId, lat, lng);
    const modifyPet = await modifyPetData({
      id: petId,
      name,
      lastLocation,
      photoURL: newPhoto,
      lat: lat,
      lng: lng,
    });
    res.status(200).json("mascota modificada correctamente");
  } catch (error) {
    console.log({ error });
    res.status(400).json(error.message);
  }
});

app.patch("/user", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any)._user.id;
    const { name, location } = req.body;
    const modifyUser = await modifyUserData({
      id: userId,
      name: name,
      location: location,
    });
    res.status(200).json("usuario modificado correctamente");
  } catch (error) {
    console.log({ error });
    res.status(400).json(error.message);
  }
});

app.patch("/auth", authMiddleware, async (req, res) => {
  const userId = (req as any)._user.id;
  const { password } = req.body;

  try {
    const respuesta = await patchAuth(userId, password);
    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// app.delete("/test", async (req, res) => {
//   try {
//     const { photoURL } = req.body;
//     const result = await deletePetPhoto(photoURL);

//     res.status(200).json({ message: "Imagen eliminada", result });
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar la imagen", error });
//   }
// });
app.get("/pets-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const busqueda = await searchNearPets(lat, lng);
    res.json(busqueda);
  } catch (error) {
    console.log(error, "error al buscar la mascota");
    res.status(400).json(error.message);
  }
});

const staticDirPath = path.resolve(__dirname, "../fe-dist");

app.use(express.static(staticDirPath));

app.get("*", (req, res) => {
  res.sendFile(staticDirPath + "/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
