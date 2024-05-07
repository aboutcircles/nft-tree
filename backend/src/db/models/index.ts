// @ts-nocheck
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";
import transfer from "./transfer.js";
import treeData from "./treeData.js";

const env = (process.env.NODE_ENV as keyof typeof config) || "development";
const { database, username, password, host, dialect, dialectOptions } =
  config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: console.log,
  dialectOptions,
});

// const models = {
//   Transfer: require("./transfer")(sequelize, DataTypes),
//   TreeData: require("./treeData")(sequelize, DataTypes),
// };

const models = {
  Transfer: transfer(sequelize, DataTypes),
  TreeData: treeData(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const db = {
  sequelize,
  Sequelize,
  models,
};

export { db };
