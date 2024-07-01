import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./test.db", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    // nftAmount INTEGER DEFAULT 0, up to 3
    // nftMinted INTEGER DEFAULT 0, up to 3
    // processed INTEGER DEFAULT 0, boolean 0 - false, 1 - true
    // cancelled INTEGER DEFAULT 0, boolean 0 - false, 1 - true
    db.run(
      `
      CREATE TABLE IF NOT EXISTS transfers (
        transactionHash TEXT PRIMARY KEY,
        fromAddress TEXT,
        toAddress TEXT,
        timestamp TEXT,
        amount TEXT,
        blockNumber TEXT,
        nftAmount INTEGER DEFAULT 0,
        nftMinted INTEGER DEFAULT 0,
        processed INTEGER DEFAULT 0,
        cancelled INTEGER DEFAULT 0
      )
    `,
      (err) => {
        if (err) {
          console.error("Failed to create table", err);
        }
      }
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS treeData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nftId TEXT,
        address TEXT,
        username TEXT,
        imageUrl TEXT,
        steps TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Failed to create treeData table", err);
        }
      }
    );
  }
});

export default db;
