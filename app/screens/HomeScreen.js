import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  Modal,
  SafeAreaView,
} from "react-native";

import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import cards from "../assets/cards.png";
import play from "../assets/play.png";

import { colors } from "../assets/colors";
import gameLogo from "../assets/gameLogo.png";
import logo from "../assets/logo.png";
import { strings } from "../assets/languages";
import DataContext from "../../DataContext";

const width = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  const { language } = useContext(DataContext);

  return (
    <View style={styles.home}>
      <View style={styles.logoArea}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={gameLogo}
            resizeMode="contain"
          />
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
            <Image source={play} style={{ width: "60%", height: "60%" }} />
          </TouchableOpacity>
          {/* === cards button === */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.push("CardCategories")}
          >
            <Image source={cards} style={{ width: "70%", height: "70%" }} />
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
      <View style={styles.watermark}>
        <Text style={{ fontSize: 13, fontStyle: "italic" }}>
          {strings[language].gameBy}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: "CentraMedium" }}>
          Mert Gürer
        </Text>
      </View>
      <HeaderRightComponent language={language} />
    </View>
  );
};

const HeaderRightComponent = ({ language }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.infoContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <AntDesign name="questioncircle" size={30} color={colors.black} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalFrame}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{strings[language].howToPlay}</Text>
            <Text style={styles.modalText}>
              {strings[language].howToPlayInfo}
            </Text>
            <View style={styles.infoLogo}>
              <Image style={{ width: 80, height: 45 }} source={logo} />
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.primary,
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
  watermark: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  infoContainer: {
    position: "absolute",
    right: 15,
  },
  modalFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "75%",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.tint,
    backgroundColor: colors.third,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  modalTitle: {
    fontFamily: "CentraBold",
    fontSize: 30,
    textAlign: "center",
  },
  modalText: {
    fontFamily: "CentraBook",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
  },
  infoLogo: {
    marginTop: 20,
    width: 80,
    height: 45,
    backgroundColor: colors.primary,
  },
});

export default HomeScreen;
