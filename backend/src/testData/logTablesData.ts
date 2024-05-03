// import db from "./testDatabase.js";
import { db } from "../database.js";

// Log all rows from the 'transfers' table
db.all("SELECT * FROM transfers", (err, rows) => {
  if (err) {
    console.error("Failed to retrieve data from transfers table", err);
  } else {
    console.log("Transfers Table Data:", rows);
  }
});

// Log all rows from the 'treeData' table
db.all("SELECT * FROM treeData", (err, rows) => {
  if (err) {
    console.error("Failed to retrieve data from treeData table", err);
  } else {
    console.log("TreeData Table Data:", rows);
  }
});
