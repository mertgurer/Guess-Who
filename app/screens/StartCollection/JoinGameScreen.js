import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Ionicons from "react-native-vector-icons/Ionicons";

import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { strings } from "../../assets/languages";

const JoinGameScreen = () => {
  const { language } = useContext(DataContext);
  const [roomCode, setRoomCode] = useState();

  const handleChange = (text) => {
    setRoomCode(text.replace(/[^0-9]/g, ""));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient
        style={styles.container}
        colors={[colors.background1, colors.background2, colors.background3]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>{strings[language].codeInfo}</Text>
        </View>

        <TextInput
          style={styles.roomCodeInput}
          onChangeText={handleChange}
          value={roomCode}
          placeholder={strings[language].codeInfo}
          keyboardType="numeric"
          maxLength={4}
        />
        <TouchableOpacity
          onPress={() => joinRoom({ roomCode: roomCode })}
          activeOpacity={0.8}
        >
          <View style={styles.joinButton}>
            <Ionicons name="arrow-forward" size={50} color={colors.black} />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default JoinGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: 200,
    height: 60,
    backgroundColor: colors.third,
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 30,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "CentraBook",
  },
  roomCodeInput: {
    backgroundColor: colors.secondary,
    width: 220,
    height: 60,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
  joinButton: {
    width: 220,
    height: 60,
    backgroundColor: colors.third,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 0,
  },
});

const joinRoom = (roomCode) => {
  console.log(roomCode);
};
