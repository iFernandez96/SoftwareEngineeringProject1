import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="pokemon" options={{ title: "Pokemon Search" }} />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
      <Tabs.Screen name="signup" options={{ title: "Sign Up" }} />
    </Tabs>
  );
}

