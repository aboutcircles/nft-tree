import { db } from "../db/models/index.js";

// Log all rows from the 'transfers' table using Sequelize
db.models.Transfer.findAll()
  .then((transfers: any) => {
    console.log("Transfers Table Data:", transfers);
  })
  .catch((err: any) => {
    console.error("Failed to retrieve data from transfers table", err);
  });

// Log all rows from the 'treeData' table using Sequelize
db.models.TreeData.findAll()
  .then((treeData: any) => {
    console.log("TreeData Table Data:", treeData);
  })
  .catch((err: any) => {
    console.error("Failed to retrieve data from treeData table", err);
  });
