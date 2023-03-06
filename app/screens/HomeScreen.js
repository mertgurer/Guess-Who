import React from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";

import { colors } from "../assets/colors";
import logo from "../assets/logo.png";

const width = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      style={styles.home}
      colors={[colors.background1, colors.background2, colors.background3]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.logoArea}>
        <View style={styles.logo}>
          <Image style={styles.logoImage} source={logo} resizeMode="contain" />
        </View>
      </View>
      <View style={styles.buttonArea}>
        <View style={styles.buttonZone}>
          {/* === start button === */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.push("Play")}
          >
            <Octicons name="play" size={55} color={colors.black} />
          </TouchableOpacity>
          {/* === cards button === */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.push("CardCategories")}
          >
            <MaterialCommunityIcons
              name="cards"
              size={60}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        {/* === settings button === */}
        <TouchableOpacity
          style={[styles.button, styles.buttonSettings]}
          activeOpacity={0.8}
          onPress={() => navigation.push("Settings")}
        >
          <Octicons name="gear" size={50} color={colors.black} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

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
    width: 300,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    flex: 1,
  },
  buttonArea: {
    flex: 5,
    width: "60%",
    alignItems: "center",
  },
  buttonZone: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.black,

    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonSettings: {
    width: "100%",
    aspectRatio: 2.5,
    marginTop: width * 0.024,
  },
});

export default HomeScreen;
