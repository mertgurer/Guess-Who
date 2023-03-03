import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
} from "react-native";
import React, { useContext, useState } from "react";
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
    <View style={styles.settings}>
      <View>
        <Text style={styles.infoText}>Username</Text>
        <View style={styles.usernameZone}>
          <TextInput
            style={styles.input}
            onChangeText={setInput}
            value={input}
            placeholder={"Enter Username..."}
          />
          <TouchableOpacity onPress={submitUsername}>
            <Ionicons
              style={styles.saveButton}
              name="checkmark-sharp"
              size={50}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          saveCardState();
          setCustomCardsArray(undefined);
        }}
      >
        <Text>Delete all custom card sets</Text>
      </TouchableOpacity>
    </View>
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
    paddingBottom: 10,
    paddingLeft: 5,
  },
  usernameZone: {
    flexDirection: "row",
  },
  input: {
    backgroundColor: colors.secondary,
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.third,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.white,
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
