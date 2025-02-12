import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import Pokedex from "./pokedex";
import PokemonSearch from "./pokemon";
import LoginScreen from "./login";
import SignUpScreen from "./signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"; 
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#1e1e1e" },
        headerShown: false,
      })}
    >
      {isAuthenticated ? (
        <>
          <Tab.Screen name="Home" component={Pokedex} />
          <Tab.Screen name="Search" component={PokemonSearch} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Signup" component={SignUpScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

