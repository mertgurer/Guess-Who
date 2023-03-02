import React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Dimensions,
  Pressable,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";

import backImage from "../assets/backImage.gif";

const { width } = Dimensions.get("window");

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
          {/* === start button === */}
          <Pressable onPress={() => console.log("start pressed")}>
            <View style={styles.button}>
              <Octicons name="play" size={55} color="#fff" />
            </View>
          </Pressable>
          {/* === cards button === */}
          <Pressable onPress={() => navigation.push("CardCategories")}>
            <View style={styles.button}>
              <MaterialCommunityIcons name="cards" size={60} color="#fff" />
            </View>
          </Pressable>
        </View>
        {/* === settings button === */}
        <Pressable onPress={() => console.log("settings pressed")}>
          <View style={[styles.button, styles.buttonSettings]}>
            <Octicons name="gear" size={50} color="#fff" />
          </View>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: "center",
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
    justifyContent: "space-between",
  },
  button: {
    width: 120,
    aspectRatio: 1,
    backgroundColor: "#913034aa",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 15,
  },
  buttonSettings: {
    width: 250,
    aspectRatio: 2.5,
  },
});

export default HomeScreen;
