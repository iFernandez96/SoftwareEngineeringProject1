import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import bcrypt from 'react-native-bcrypt';


type QueryType = 'select' | 'run';

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
  console.log("Initializing database...");
  await executeSql(`PRAGMA journal_mode = WAL;`, [], 'run');

  // await executeSql(`DROP TABLE IF EXISTS users;`); //TEST PURPOSES ONLY

  await executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
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
  name: string,
  age: number,
  username: string,
  password: string
): Promise<number | null> {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const result = await executeSql(
      `INSERT INTO users (name, age, username, password) VALUES (?, ?, ?, ?);`,
      [name, age, username, hashedPassword],
      "run"
    );

    console.log("User successfully inserted:", result);
    
    if (result && "lastInsertRowId" in result && result.lastInsertRowId) {
      return result.lastInsertRowId; 
    } else {
      console.error("Error: lastInsertRowId is undefined");
      return null;
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    return null;
  }
}

export const loginUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; user?: { id: number; name: string; age: number; username: string } }> => {
  const rows = await executeSql(
    `SELECT id, name, age, username, password FROM users WHERE username = ?;`,
    [username],
    'select'
  );

  if (rows && rows.length > 0) {
    const user = rows[0];

    if (bcrypt.compareSync(password, user.password)) {
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          username: user.username
        }
      };
    }
  }
  return { success: false };
};

export const getUserProfile = async (
  username: string
): Promise<{ name: string; age: number; username: string } | null> => {
  const rows = await executeSql(
    `SELECT name, age, username FROM users WHERE username = ?;`,
    [username],
    'select'
  );

  if (rows && rows.length > 0) {
    return rows[0];
  }
  return null;
};

export const updateName = async (userId: Number, newName: string): Promise<boolean> => {
  try {
    await executeSql(
      `UPDATE users SET name = ? WHERE id = ?;`,
      [newName, userId],
      'run'
    );
    return true;
  } catch (error) {
    console.error("Error updating name:", error);
    return false;
  }
};

export const updateAge = async (userId: Number, age: number): Promise<boolean> => {
  try {
    await executeSql(
      `UPDATE users SET age = ? WHERE id = ?;`,
      [age, userId],
      'run'
    );
    return true;
  } catch (error) {
    console.error("Error updating age:", error);
    return false;
  }
};

export const updateUserName = async (userId: Number, newUserName: string): Promise<boolean> => {
  try {
    await executeSql(
      `UPDATE users SET username = ? WHERE id = ?;`,
      [newUserName, userId],
      'run'
    );
    return true;
  } catch (error) {
    console.error("Error updating username:", error);
    return false;
  }
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
  pokemonId: number
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
  ranking: number
): Promise<number> => {
  const result = await executeSql(
    `INSERT INTO user_top6 (user_id, pokemon_id, ranking) VALUES (?, ?, ?);`,
    [userId, pokemonId, ranking],
    'run'
  );
  return result.lastInsertRowId;
};
