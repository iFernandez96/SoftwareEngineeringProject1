import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

export interface User {
  id?: number;
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface FavoritePokemon {
  id?: number;
  user_id: number;
  pokemon_name: string;
}

export const createTables = (): void => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );`,
      [],
      () => console.log('Users table created successfully'),
      (_, error) => {
        console.error('Error creating users table:', error);
        return false;
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pokemon_name TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`,
      [],
      () => console.log('Favorites table created successfully'),
      (_, error) => {
        console.error('Error creating favorites table:', error);
        return false;
      }
    );
  });
};

export const insertUser = (user: User, callback: (success: boolean) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?);`,
      [user.username, user.name, user.email, user.password],
      (_, result) => {
        console.log('User inserted:', result);
        callback(true);
      },
      (_, error) => {
        console.error('Error inserting user:', error);
        callback(false);
        return false;
      }
    );
  });
};

export const fetchUsers = (callback: (users: User[]) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM users;`,
      [],
      (_, { rows }) => {
        callback(rows._array);
      },
      (_, error) => {
        console.error('Error fetching users:', error);
        return false;
      }
    );
  });
};

export const insertFavoritePokemon = (user_id: number, pokemon_name: string, callback: (success: boolean) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO favorites (user_id, pokemon_name) VALUES (?, ?);`,
      [user_id, pokemon_name],
      (_, result) => {
        console.log('Favorite Pokémon added:', result);
        callback(true);
      },
      (_, error) => {
        console.error('Error inserting favorite Pokémon:', error);
        callback(false);
        return false;
      }
    );
  });
};

export const fetchFavoritePokemon = (user_id: number, callback: (favorites: FavoritePokemon[]) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM favorites WHERE user_id = ?;`,
      [user_id],
      (_, { rows }) => {
        callback(rows._array);
      },
      (_, error) => {
        console.error('Error fetching favorite Pokémon:', error);
        return false;
      }
    );
  });
};

export const deleteFavoritePokemon = (id: number, callback: (success: boolean) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM favorites WHERE id = ?;`,
      [id],
      (_, result) => {
        console.log('Favorite Pokémon deleted:', result);
        callback(true);
      },
      (_, error) => {
        console.error('Error deleting favorite Pokémon:', error);
        callback(false);
        return false;
      }
    );
  });
};

export default db;

