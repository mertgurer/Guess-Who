import React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";

import { colors } from "../assets/colors";
import backImage from "../assets/backImage.gif";

const width = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      style={styles.home}
      /* source={backImage} */
      resizeMode={"stretch"}
    >
      <View style={styles.logoArea}>
        <Text style={styles.logo}>Guess Who</Text>
      </View>
      <View style={styles.buttonArea}>
        <View style={styles.buttonZone}>
          {/* === start button === */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.push("Start")}
          >
            <Octicons name="play" size={55} color={colors.white} />
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
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        {/* === settings button === */}
        <TouchableOpacity
          style={[styles.button, styles.buttonSettings]}
          activeOpacity={0.8}
          onPress={() => navigation.push("Settings")}
        >
          <Octicons name="gear" size={50} color={colors.white} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  logoArea: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    color: colors.white,
    fontSize: 40,
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
    borderWidth: 1,
    borderColor: colors.white,
  },
  buttonSettings: {
    width: "100%",
    aspectRatio: 2.5,
    marginTop: width * 0.024,
  },
});

export default HomeScreen;
