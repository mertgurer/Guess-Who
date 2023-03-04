import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  ImageBackground,
} from "react-native";
import React, { useContext, useState } from "react";

import backImage from "../assets/backImage.png";
import { colors } from "../assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DataContext from "../../DataContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const SettingsScreen = () => {
  const { username, setUsername, setCustomCardsArray } =
    useContext(DataContext);
  const [input, setInput] = useState(username);

  const submitUsername = async () => {
    filteredInput = input.trim();

    try {
      if (filteredInput !== username && filteredInput.length !== 0) {
        setUsername(filteredInput);
        await AsyncStorage.setItem("username", filteredInput);
        successAlert({ newUsername: filteredInput });
      } else if (filteredInput === username) {
        failAlert({ message: "Username is same as before" });
      } else {
        failAlert({ message: "Username can't be empty" });
      }
    } catch (e) {
      console.log(e);
    }

    setInput(filteredInput);
  };

  return (
    <ImageBackground style={styles.settings} source={backImage}>
      <View>
        <Text style={styles.infoText}>Username</Text>
        <View style={styles.usernameZone}>
          <TextInput
            style={styles.input}
            onChangeText={setInput}
            value={input}
            placeholder={"Enter Username..."}
          />
          <TouchableOpacity onPress={submitUsername} activeOpacity={0.8}>
            <View style={styles.saveButton}>
              <Ionicons name="checkmark-sharp" size={50} color={colors.black} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          deleteAlert({ setCustomCardsArray: setCustomCardsArray })
        }
        activeOpacity={0.8}
      >
        <View style={styles.clearCustomCards}>
          <Text style={{ fontWeight: "700" }}>Delete all custom card sets</Text>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  settings: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    padding: 5,
    color: colors.white,
  },
  usernameZone: {
    flexDirection: "row",
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.secondary,
    width: 220,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  saveButton: {
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
  clearCustomCards: {
    marginVertical: 30,
    width: 240,
    height: 60,
    backgroundColor: colors.third,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 10,
  },
});

export default SettingsScreen;

const saveCardState = async () => {
  try {
    await AsyncStorage.removeItem("customCards");
  } catch (e) {
    console.log(e);
  }
};

const successAlert = ({ newUsername }) => {
  Alert.alert("Change Successful", `New username is set to ${newUsername}`, [
    {
      text: "OK",
      onPress: () => Keyboard.dismiss(),
    },
  ]);
};

const failAlert = ({ message }) => {
  Alert.alert("Change Failed", message);
};

const deleteAlert = ({ setCustomCardsArray }) => {
  Alert.alert("Are you sure you want to delete all custom card sets", "", [
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        saveCardState();
        setCustomCardsArray(undefined);
      },
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]);
};
