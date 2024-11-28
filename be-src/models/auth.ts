import { Model, DataTypes } from "sequelize";
import { sequelize } from "./../db/index";
export class Auth extends Model {}
Auth.init(
  {
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { sequelize, modelName: "Auth" }
);
