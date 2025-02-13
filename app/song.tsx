import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function Song() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/PokemonThemeSong.mp3"), //or try 'PokemonSongV2.mp3'
        { isLooping: true }
      );
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync(); // Cleanup when component unmounts
      }
    };
  }, []);

  const toggleSound = async () => {
    if (sound) {
      if (isMuted) {
        await sound.playAsync();
      } else {
        await sound.stopAsync();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <TouchableOpacity
    onPress={toggleSound} 
    style={[styles.button, { backgroundColor: isMuted ? "rgba(206, 74, 46, 0.5)" : "rgba(255, 255, 255, 0.5)" }]} //used rgba to slightly change the opacity
    >
      <Text style={styles.buttonText}>{isMuted ? "🔇" : "🔊"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: ("#ce4a2e"),
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
