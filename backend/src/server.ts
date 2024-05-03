import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
const app = express();
const PORT = 8000;

import { spawn } from "child_process";

const db = new sqlite3.Database(
  "./transfers.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database", err);
    }
  }
);

const dbTest = new sqlite3.Database(
  "./test.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database", err);
    }
  }
);

// Start the background task as a separate process
const background = spawn("node", ["dist/processTransfers/index.js"]);

background.stdout.on("data", (data: Buffer) => {
  console.log(`Minting task says: ${data.toString()}`);
});

background.stderr.on("data", (data: Buffer) => {
  console.error(`Minting task had an error: ${data}`);
});

app.get("/tree-data", (req: Request, res: Response) => {
  console.log("🟢 GET /tree-data");
  const lastFetchedId = req.query.id || 0;
  db.all(
    "SELECT * FROM treeData WHERE id > ?",
    [lastFetchedId],
    (err: Error | null, rows: any[]) => {
      if (err) {
        res.status(500).send("Failed to retrieve data from database.");
        console.error(err.message);
      } else {
        res.json(rows);
      }
    }
  );
});

app.get("/tree-test", (req: Request, res: Response) => {
  console.log("🟢 GET /tree-test");
  const lastFetchedId = req.query.id || 0;
  dbTest.all(
    "SELECT * FROM treeData WHERE id > ?",
    [lastFetchedId],
    (err: Error | null, rows: any[]) => {
      if (err) {
        res.status(500).send("Failed to retrieve data from database.");
        console.error(err.message);
      } else {
        res.json(rows);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});
