import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./mintingStatus.db", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database opened successfully");
    // Ensure table creation is complete before proceeding
    db.run(
      `
      CREATE TABLE IF NOT EXISTS mintingStatus (
        status INTEGER DEFAULT 0
      )
    `,
      (err) => {
        if (err) {
          console.error("Failed to create table", err);
        } else {
          console.log("Table created or already exists");
          initializeMintingStatusDB()
            .then(() => {
              console.log("Database initialized successfully");
            })
            .catch((initErr) => {
              console.error("Failed to initialize database", initErr);
            });
        }
      }
    );
  }
});

export const initializeMintingStatusDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO mintingStatus (status) SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM mintingStatus WHERE status IS NOT NULL)`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const setStatusMinting = (status: boolean) => {
  db.run(`UPDATE mintingStatus SET status = ${status ? 1 : 0}`);
};

interface MintingStatusRow {
  status: number;
}

export const getStatusMinting = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT status FROM mintingStatus`,
      (err, row: MintingStatusRow | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.status === 1 : false);
        }
      }
    );
  });
};
