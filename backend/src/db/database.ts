// import { Sequelize } from "sequelize";
// import Transfer from "./models/transfer.js";
// import TreeData from "./models/treeData.js";

// // // Initialize Sequelize connection
// // const sequelize = new Sequelize(
// //   "postgres://username:password@localhost:5432/mydatabase",
// //   {
// //     dialect: "postgres",
// //     logging: false,
// //   }
// // );

// // // Initialize models
// // Transfer.init(sequelize);
// // TreeData.init(sequelize);

// // Function to authenticate and sync the database
// const initializeDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//     await sequelize.sync({ force: false }); // Consider using { force: true } only in development
//     console.log("Database synchronized.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// export { sequelize, initializeDatabase };

// import sqlite3 from "sqlite3";

// const db = new sqlite3.Database(
//   "./transfers.db",
//   sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
//   (err: Error | null) => {
//     if (err) {
//       console.error("Error opening database", err);
//       throw err; // Ensure to throw or handle the error appropriately
//     }
//   }
// );

// const initializeDatabase = () => {
//   return new Promise<void>((resolve, reject) => {
//     db.serialize(() => {
//       db.run(
//         `
//         CREATE TABLE IF NOT EXISTS transfers (
//           transactionHash TEXT PRIMARY KEY,
//           fromAddress TEXT,
//           toAddress TEXT,
//           timestamp TEXT,
//           amount TEXT,
//           crcAmount TEXT,
//           blockNumber TEXT,
//           nftAmount INTEGER DEFAULT 0,
//           nftMinted INTEGER DEFAULT 0,
//           processed INTEGER DEFAULT 0,
//           cancelled INTEGER DEFAULT 0
//         )
//       `,
//         (err) => {
//           if (err) {
//             console.error("Failed to create transfers table", err);
//             reject(err);
//           }
//         }
//       );

//       db.run(
//         `
//         CREATE TABLE IF NOT EXISTS treeData (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           nftIds TEXT,
//           crcAmount TEXT,
//           address TEXT,
//           username TEXT,
//           imageUrl TEXT,
//           steps TEXT,
//           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
//         )
//       `,
//         (err) => {
//           if (err) {
//             console.error("Failed to create treeData table", err);
//             reject(err);
//           } else {
//             resolve();
//           }
//         }
//       );
//     });
//   });
// };

// export { db, initializeDatabase };
