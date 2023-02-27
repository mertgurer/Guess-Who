import React from "react";
import { StyleSheet, SafeAreaView, Text, ImageBackground } from "react-native";

export function HomeScreen() {
  return (
    <ImageBackground style={styles.background}>
      <SafeAreaView style={styles.box}>
        <Text style={styles.text}>Hi</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    position: "absolute",
    top: 70,
  },
  text: {
    backgroundColor: "blue",
    color: "white",
  },
});

export default HomeScreen;
