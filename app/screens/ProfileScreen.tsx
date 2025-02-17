import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { updateUserName, updateAge, updateName } from '@/database/Database'
import { useRouter } from "expo-router";
import Song from "../song";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: Number, name: string; age: number; username: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [name, setName] = useState("");

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
      <Song />

      <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={async () => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Update Profile</Text>
              
              <Text style={styles.modalText}>Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <Text style={styles.modalText}>Age:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter your Age"
                placeholderTextColor="#aaa"
                value={age}
                onChangeText={setAge}
               />
              <Text style={styles.modalText}>Username:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
              />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={async () => {
                if (!user) return;
                // Update the user profile with the new values
                await updateAge(user.id, Number(age));
                await updateName(user.id, name);
                await updateUserName(user.id, username);
                // Optionally update the local state if needed
                setUser({ ...user, age: Number(age), name, username });
                setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Update User Information</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
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
  input: {
    height: 40,
    width: "100%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }, 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
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

