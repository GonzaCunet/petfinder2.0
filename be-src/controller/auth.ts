import { Sequelize } from "sequelize";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { User, Auth, Pets } from "./../models/models";
const secret = process.env.SECRET;

export async function hashPassword(text: string) {
  return crypto.createHash("sha256").update(JSON.stringify(text)).digest("hex");
}

export async function authUsers(email, password) {
  const passwordHasheado = await hashPassword(password);
  try {
    let auth = await Auth.findOne({ where: { email } });
    if (auth) {
      throw new Error("este usuario ya se ha registrado salu2");
    }

    if (!auth) {
      auth = await Auth.create({ email, password: passwordHasheado });
    }
    return auth;
  } catch (error) {
    throw error;
  }
}

export async function authToken(email, password) {
  const passwordHasheado = await hashPassword(password);
  try {
    const userAuth: any = await Auth.findOne({
      where: { email, password: passwordHasheado },
      include: {
        model: User,
        attributes: ["id"],
      },
    });
    if (userAuth) {
      const userId = userAuth.User.id;
      const token = jwt.sign({ id: userId }, secret);
      return token;
    }
    if (!userAuth) {
      throw new Error("Email o contraseña inválida");
    }
  } catch (error) {
    throw error;
  }
}
export async function getAuth() {
  try {
    const users = await Auth.findAll();
    return users;
  } catch (error) {
    throw error;
  }
}
export async function getAuthByIdUser(userId) {
  const user = await User.findByPk(userId);
  const authId = user.get("AuthId");
  return authId;
}
// {
//   "id": "1018828604764422145",
//   "name": "unnombreEditado",
//   "location": "localidadEditada",
//   "createdAt": "2024-11-07T15:10:17.078Z",
//   "updatedAt": "2024-11-21T00:37:28.581Z",
//   "AuthId": "1018828604173680641"
// }
export async function patchAuth(userId, password) {
  try {
    const passwordHasheado = await hashPassword(password);
    const user = await User.findOne({ where: { id: userId } });
    const authId = user.get("AuthId");
    return await Auth.update(
      {
        password: passwordHasheado,
      },
      { where: { id: authId } }
    );
    //necesito sacar el auth id del user
    //saco el authid para poder hacer el update del auth
  } catch (error) {
    throw error;
  }
}
//5567d92276ced3112f57bbd90812e2133b78736c6201963823405e69077d3141

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const data = jwt.verify(token, secret);
    req._user = data;
    next();
  } catch (error) {
    res.status(401).json({ error: "token no autorizado" });
  }
}
