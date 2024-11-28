import { User } from "./user";
import { Auth } from "./auth";
import { Pets } from "./pets";

Auth.hasOne(User);
User.belongsTo(Auth);
User.hasMany(Pets);
Pets.belongsTo(User);

export { Auth, User, Pets };
