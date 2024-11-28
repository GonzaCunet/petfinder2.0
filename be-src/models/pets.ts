import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/index";
export class Pets extends Model {}
Pets.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    lastLocation: { type: DataTypes.STRING, allowNull: false },
    photoURL: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false },
    lat: { type: DataTypes.STRING, allowNull: false },
    lng: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Pets" }
);
