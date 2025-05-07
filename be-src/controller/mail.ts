import { Resend } from "resend";
import { getPetById } from "./pets";
import { getAuthByIdUser } from "./auth";
import { Auth } from "../models/auth";
const resend = new Resend(process.env.RESEND_KEY);
export async function findMail(petId) {
  try {
    const pet = await getPetById(petId);
    const userId = pet.get("UserId");

    const authId: any = await getAuthByIdUser(userId);
    const auth = await Auth.findByPk(authId);
    const mail = auth.get("email");
    return mail;
  } catch (error) {
    throw error;
  }
}

export async function sendMail(email, name, phone, textarea) {
  try {
    console.log("hola");
    const respuesta = await resend.emails.send({
      from: `Pet Finder App <onboarding@resend.dev>`,
      to: ["gonza.cunet@outlook.com"], //acá iría el email
      subject: "ví la mascota que publicaste",
      html: `hola, ${name} vio tu mascota, podes comunicarte con él al siguiente número: ${phone} y te dejó este mensaje: ${textarea}`,
    });
    console.log(respuesta);
  } catch (error) {
    throw error;
  }
}
