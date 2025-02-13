import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/database/Database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !age || !username || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userId = await registerUser(name, parseInt(age), username, password);
      if (userId) {
        const newUser = { id: userId, name, age, username };
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        Alert.alert("Registration Successful!", "Logging you in...");
        router.replace("/"); // go to home
      } else {
        Alert.alert("Registration Failed", "Username might already exist.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        placeholderTextColor="#aaa"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
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
      <Button title="Sign Up" onPress={handleRegister} color="#4caf50" />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}>Click here to login</Text>
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
  loginContainer: {
    marginTop: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  loginText: {
    color: "#aaa",
    fontSize: 14,
  },
  loginLink: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 14,
  },
});
