import { Tabs } from "expo-router";
// import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeDatabase } from "@/database/Database";

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase();
  });

  return (
  
//   <Stack screenOptions={{ headerShown: false }}/> 

    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="pokemon" options={{ title: "Pokemon Search" }} />
      <Tabs.Screen name="pokedex" options={{ title: "Pokedex" }} />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
      <Tabs.Screen name="signup" options={{ title: "Sign Up" }} />
    </Tabs>
  );
}
