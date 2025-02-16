import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; age: number; username: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // clear user session
    setUser(null); // reset user state
    router.replace("/login"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {user ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}><Text style={styles.label}>Name:</Text> {user.name}</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Age:</Text> {user.age}</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Username:</Text> {user.username}</Text>
        </View>
      ) : (
        <Text style={styles.infoText}>Loading user data...</Text>
      )}

      <Button title="Sign Out" onPress={handleLogout} color="#ff4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25292e",
    paddingTop: 75,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 10,
    width: "80%",
    marginBottom: 20,
  },
  infoText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#4caf50",
  },
});

