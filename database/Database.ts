import * as SQLite from "expo-sqlite";
import bcrypt from "bcryptjs";

const db = SQLite.openDatabase("pokedex.db");

// Execute SQL and return a promise
export const executeSql = (
  query: string,
  params: any[] = [],
): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const initializeDatabase = async () => {
  await executeSql(`PRAGMA journal_mode = WAL;`);
  await executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      username TEXT UNIQUE,
      password TEXT
    );
  `);
  await executeSql(`
    CREATE TABLE IF NOT EXISTS pokemon (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);
  await executeSql(`
    CREATE TABLE IF NOT EXISTS user_likes (
      id INTEGER PRIMARY KEY NOT NULL,
      user_id INTEGER,
      pokemon_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(pokemon_id) REFERENCES pokemon(id)
    );
  `);
  await executeSql(`
    CREATE TABLE IF NOT EXISTS user_top6 (
      id INTEGER PRIMARY KEY NOT NULL,
      user_id INTEGER,
      pokemon_id INTEGER,
      ranking INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(pokemon_id) REFERENCES pokemon(id)
    );
  `);
};

export const registerUser = async (
  username: string,
  password: string,
): Promise<number> => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const result = await executeSql(
    `INSERT INTO users (username, password) VALUES (?, ?);`,
    [username, hashedPassword],
  );
  return result.insertId;
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<boolean> => {
  const result = await executeSql(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  if (result.rows.length > 0) {
    const user = result.rows.item(0);
    return bcrypt.compareSync(password, user.password);
  }
  return false;
};

export const addPokemon = async (name: string): Promise<number> => {
  const result = await executeSql(`INSERT INTO pokemon (name) VALUES (?);`, [
    name,
  ]);
  return result.insertId;
};

export const addFavouritePokemon = async (
  userId: number,
  pokemonId: number,
): Promise<number> => {
  const result = await executeSql(
    `INSERT INTO user_likes (user_id, pokemon_id) VALUES (?, ?);`,
    [userId, pokemonId],
  );
  return result.insertId;
};

export const updateUserTop6 = async (
  userId: number,
  pokemonId: number,
  ranking: number,
): Promise<number> => {
  const result = await executeSql(
    `INSERT INTO user_top6 (user_id, pokemon_id, ranking) VALUES (?, ?, ?);`,
    [userId, pokemonId, ranking],
  );
  return result.insertId;
};
