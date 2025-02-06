import { Tabs } from "expo-router";
// import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeDatabase, executeSql } from "@/database/Database";

export default function RootLayout() {
  useEffect(() => {
    const setupDatabase = async () => {
      console.log("Initializing database..."); // log initialization 

      try {
        // initialize the database
        await initializeDatabase();
        console.log("Database initialized successfully.");

        // verify table creation
        const tables = await executeSql(
          `SELECT name FROM sqlite_master WHERE type='table';`,
          [],
          "select"
        );
        console.log("Existing tables:", tables); // log tables

        // verify schema for users table
        const userSchema = await executeSql(`PRAGMA table_info(users);`, [], "select");
        console.log("Users table schema:", userSchema); // log schema
      } catch (error) {
        console.error("Error verifying database:", error); // log any errors
      }
    };

    setupDatabase();
  }, []);

  return (
  
//   <Stack screenOptions={{ headerShown: false }}/> 

    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="pokemon" options={{ title: "Pokemon Search" }} />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
      <Tabs.Screen name="signup" options={{ title: "Sign Up" }} />
    </Tabs>
  );
}
