// database.ts
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import bcrypt from 'react-native-bcrypt';

type QueryType = 'select' | 'run';

// Pass an object with the name key:
const dbPromise: Promise<SQLiteDatabase> = openDatabaseAsync('pokedex.db');

async function getDatabase(): Promise<SQLiteDatabase> {
  return await dbPromise;
}

export const executeSql = async (
  query: string,
  params: any[] = [],
  type: QueryType = 'run'
): Promise<any> => {
  const db = await getDatabase();

  if (type === 'select') {
    return await db.getAllAsync(query, params);
  } else {
    return await db.runAsync(query, ...params);
  }
};

export const initializeDatabase = async () => {
  await executeSql(`PRAGMA journal_mode = WAL;`, [], 'run');

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

export async function registerUser(
  username: string,
  password: string
): Promise<number> {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const result = await executeSql(
    `INSERT INTO users (username, password) VALUES (?, ?);`,
    [username, hashedPassword],
    'run'
  );

  return result.insertId;
}

export const loginUser = async (
  username: string,
  password: string,
): Promise<boolean> => {
  const rows = await executeSql(
    `SELECT * FROM users WHERE username = ?;`,
    [username],
    'select'
  );

  if (rows && rows.length > 0) {
    const user = rows[0];
    return bcrypt.compareSync(password, user.password);
  }
  return false;
};

export const addPokemon = async (name: string): Promise<number> => {
  const result = await executeSql(
    `INSERT INTO pokemon (name) VALUES (?);`,
    [name],
    'run'
  );
  return result.lastInsertRowId;
};

export const addFavouritePokemon = async (
  userId: number,
  pokemonId: number,
): Promise<number> => {
  const result = await executeSql(
    `INSERT INTO user_likes (user_id, pokemon_id) VALUES (?, ?);`,
    [userId, pokemonId],
    'run'
  );
  return result.lastInsertRowId;
};

export const updateUserTop6 = async (
  userId: number,
  pokemonId: number,
  ranking: number,
): Promise<number> => {
  const result = await executeSql(
    `INSERT INTO user_top6 (user_id, pokemon_id, ranking) VALUES (?, ?, ?);`,
    [userId, pokemonId, ranking],
    'run'
  );
  return result.lastInsertRowId;
};
