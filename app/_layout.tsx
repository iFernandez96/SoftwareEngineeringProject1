import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeDatabase, executeSql } from "@/database/Database";

export default function RootLayout() {
  useEffect(() => {
    const setupDatabase = async () => {
      console.log("Initializing database...");

      try {
        await initializeDatabase();
        console.log("Database initialized successfully.");

        const tables = await executeSql(
          `SELECT name FROM sqlite_master WHERE type='table';`,
          [],
          "select"
        );
        console.log("Existing tables:", tables);

        const userSchema = await executeSql(`PRAGMA table_info(users);`, [], "select");
        console.log("Users table schema:", userSchema);
      } catch (error) {
        console.error("Error verifying database:", error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
