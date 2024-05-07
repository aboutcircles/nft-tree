import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import { spawn } from "child_process";
import { db } from "./db/models/index.js";
import { Op } from "sequelize";

const app = express();
const PORT = 8000;

(async () => {
  try {
    // await db.sequelize.sync();
    console.log("Database initialized successfully.");
    // Start your server here or perform other database operations

    // Start the background task as a separate process
    const background = spawn("node", ["dist/processTransfers/index.js"]);

    background.stdout.on("data", (data: Buffer) => {
      console.log(`Minting task says: ${data.toString()}`);
    });

    background.stderr.on("data", (data: Buffer) => {
      console.error(`Minting task had an error: ${data}`);
    });

    background.on("close", (code: number) => {
      console.log(`Minting task exited with code: ${code}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
})();

const dbTest = new sqlite3.Database(
  "./test.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database", err);
    }
  }
);

app.get("/tree-data", (req: Request, res: Response) => {
  console.log("🟢 GET /tree-data");
  const lastFetchedId = req.query.id || 0;
  db.models.TreeData.findAll({
    where: {
      id: {
        [Op.gt]: lastFetchedId,
      },
    },
  })
    .then((rows: any) => {
      res.json(rows);
    })
    .catch((err: { message: any }) => {
      res.status(500).send("Failed to retrieve data from database.");
      console.error(err.message);
    });
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

app.get("/db-transfers", (req: Request, res: Response) => {
  console.log("🟢 GET /db-transfers");
  db.models.Transfer.findAll()
    .then((rows: any) => {
      res.json(rows);
    })
    .catch((err: { message: any }) => {
      res.status(500).send("Failed to retrieve data from database.");
      console.error(err.message);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.sequelize
    .close()
    .then(() => {
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
});
