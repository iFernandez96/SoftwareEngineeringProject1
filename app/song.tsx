import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function Song() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/PokemonSongV2.mp3"), //or try 'PokemonSongV2.mp3' 'PokemonThemeSong.mp3'
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
    <TouchableOpacity onPress={toggleSound} style={styles.button}>
      <Image
        source={
          isMuted
            ? require("@/assets/images/pokeballclosed.png") // Closed Pokeball image
            : require("@/assets/images/pokeballempty.png") // Open Pokeball image
        }
        style={styles.pokeball}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50,
    right: 20,
    borderRadius: 5,
  },
  pokeball: {
    width: 50,  
    height: 50,
  },
});
