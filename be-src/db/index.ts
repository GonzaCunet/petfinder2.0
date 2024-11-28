import { Sequelize } from "sequelize";
export const sequelize = new Sequelize(process.env.COACKROACHKEY);

async function sequelizeSync() {
  await sequelize.sync();
}
sequelizeSync();
