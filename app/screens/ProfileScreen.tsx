import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { getUserName } from '@/database/Database'
import { useRouter } from "expo-router";
import Song from "../song";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; age: number; username: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
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

