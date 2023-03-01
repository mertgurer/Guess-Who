import React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
} from "react-native";

import backImage from "../assets/gradient.png";

export function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      style={styles.home}
      source={backImage}
      resizeMode={"stretch"}
    >
      <View style={styles.logoArea}>
        <Text style={styles.logo}>Guess Who</Text>
      </View>
      <View style={styles.buttonArea}>
        <View style={styles.buttonZone}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              console.log("Start Pressed");
            }}
          >
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => navigation.push("CardCategories")}
          >
            <Text style={styles.buttonText}>Cards</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonZone}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              console.log("settings pressed");
            }}
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              console.log("credits Pressed");
            }}
          >
            <Text style={styles.buttonText}>Credits</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  logoArea: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    fontSize: 40,
  },
  buttonArea: {
    flex: 5,
    alignItems: "center",
  },
  buttonZone: {
    flexDirection: "row",
  },
  button: {
    width: "25%",
    aspectRatio: 1,
    backgroundColor: "#510002",
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
});

export default HomeScreen;
