import React, { useContext, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import backImage from "../../assets/backImage.png";
import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { strings } from "../../assets/languages";

const JoinGameScreen = () => {
  const { language } = useContext(DataContext);
  const [roomCode, setRoomCode] = useState();

  return (
    <ImageBackground
      style={styles.container}
      source={backImage}
      resizeMode={"stretch"}
    >
      <View style={styles.joinZone}>
        <TextInput
          style={styles.roomCodeInput}
          onChangeText={setRoomCode}
          value={roomCode}
          placeholder={strings[language].codeInfo}
          placeholderTextColor={colors.tint}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          onPress={() => joinRoom({ roomCode: roomCode })}
          activeOpacity={0.8}
        >
          <View style={styles.joinButton}>
            <Ionicons name="arrow-forward" size={50} color={colors.black} />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default JoinGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  joinZone: {
    flexDirection: "row",
  },
  roomCodeInput: {
    backgroundColor: colors.secondary,
    width: 220,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
  joinButton: {
    width: 70,
    height: 60,
    backgroundColor: colors.third,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
});

const joinRoom = (roomCode) => {
  console.log(roomCode);
};
