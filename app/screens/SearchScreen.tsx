import { Text, View, StyleSheet } from "react-native";

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search</Text>
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
})