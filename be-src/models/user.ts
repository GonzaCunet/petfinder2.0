import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/index";

export interface UserUpdateData {
  id: string;
  name: string;
  location: string;
}
export class User extends Model {}
User.init(
  {
    name: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
  },
  { sequelize, modelName: "User" }
);
