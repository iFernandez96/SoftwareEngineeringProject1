import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { loginUser } from "@/database/Database";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello world!</Text>
      <Link href="/" style={styles.link}>
        Go Home
      </Link>
    </View>
  );
}

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
  
    try {
      const { success, user } = await loginUser(username, password);
      if (success && user) {
        await AsyncStorage.setItem("user", JSON.stringify(user)); // store user data
        Alert.alert(`Welcome ${user.name}!`, "Redirecting to home page...");
        router.replace("/"); // go to home
      } else {
        Alert.alert("Login failed", "Invalid username or password");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#4caf50" />
      <View style={styles.createAccountContainer}>
        <Text style={styles.createAccountText}>
          If you don't already have an account,{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.createAccountLink}>
            click here to create one.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    marginBottom: 16,
    color: "#fff",
    backgroundColor: "#333",
  },
  createAccountContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  createAccountText: {
    color: "#aaa",
    fontSize: 14,
  },
  createAccountLink: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 14,
  },
  link: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 14,
  },
});