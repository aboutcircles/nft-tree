import sqlite3 from "sqlite3";
export const db = new sqlite3.Database("./mintingStatus.db", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS mintingStatus (
        status: INTEGER DEFAULT 0,
      )
    `,
      (err) => {
        if (err) {
          console.error("Failed to create table", err);
        }
      }
    );
  }
});

export const initializeMintingStatusDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO mintingStatus (status) SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM mintingStatus)`,
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

export const setStatusMintingTrue = () => {
  db.run(`UPDATE mintingStatus SET status = 1`);
};

export const setStatusMintingFalse = () => {
  db.run(`UPDATE mintingStatus SET status = 0`);
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
