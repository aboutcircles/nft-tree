import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
const app = express();
const PORT = 8000;

const db = new sqlite3.Database(
  "./transfers.db",
  sqlite3.OPEN_READONLY,
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database", err);
    }
  }
);

app.get("/tree-data", (req: Request, res: Response) => {
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
