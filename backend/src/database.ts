import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./transfers.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS transfers (
        transactionHash TEXT PRIMARY KEY,
        fromAddress TEXT,
        toAddress TEXT,
        timestamp TEXT,
        amount TEXT,
        blockNumber TEXT,
        processed INTEGER DEFAULT 0,
        cancelled INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error('Failed to create table', err);
      }
    });
  }
});

export default db;
