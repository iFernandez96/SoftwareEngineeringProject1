import { Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Check the Dex</Text>
      <Text style={styles.subtext}>Explore Pokemon:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#25292e",
    paddingTop: 75,
  },
  text: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign:"center",
    fontFamily: "android",
  },
  subtext: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign:"center",
    fontFamily: "android",
    marginTop: 20,
  },
})

