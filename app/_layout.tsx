import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { initializeDatabase, executeSql } from "@/database/Database";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const setupDatabase = async () => {
      console.log("Initializing database...");

      try {
        await initializeDatabase();
        console.log("Database initialized successfully.");

        // check if user is already logged in
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setIsAuthenticated(true);
          router.replace("/"); // go to home if authenticated
        } else {
          setIsAuthenticated(false);
          router.replace("/login"); // go to login if not authenticated
        }
      } catch (error) {
        console.error("Error verifying database:", error);
      }
    };

    setupDatabase();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
