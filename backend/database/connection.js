const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'data', 'healthcare.db');
  }

  async connect() {
    return new Promise((resolve, reject) => {
      // Ensure data directory exists
      const fs = require('fs');
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          resolve(this.db);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  getDatabase() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}

// Singleton instance
const dbConnection = new DatabaseConnection();

module.exports = { dbConnection };
