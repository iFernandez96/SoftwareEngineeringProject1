import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
    );`,
      [],
      () => console.log('Users table created successfully'),
      (_,error) => console.error('Error creating table:', error)
    );
  });
};

export const insertUser = (name, age, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO users (name, age) VALUES (?, ?);`,
      [name, age],
      (_,result) => {
        console.log("User inserted:", result);
        callback(true);
      },
      (_,error) => {
        console.error("Error inserting user: ", error);
        callback(false);
      }
    );
  });
};


export const fetchUsers = (callback) => {
  db.transaction(tx => {
    `SELECT * FROM users;`,
      [],
      (_, { rows }) => {
        callback(rows._array);
      },
      (_,error) => console.error("Error fetching users:", error);
  });
};


export const deleteUser = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM users WHERE id = ?;`,
      [id],
      (_,result) => {
        console.log("User Deleted:", result);
        callback(true);
      },
      (_,error) => {
        console.error("Error deleting User:", error);
        callback(false);
      }
    );
  });
};

export default db;
