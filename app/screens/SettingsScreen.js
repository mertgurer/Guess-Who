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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsScreen = () => {
  const { username, setUsername } = useContext(DataContext);
  const [input, setInput] = useState(username);

  const submitUsername = async () => {
    try {
      if (input !== username && input.length !== 0) {
        setUsername(input);
        await AsyncStorage.setItem("username", input);

        Alert.alert("Change Successful", `New username is set to ${input}`, [
          {
            text: "OK",
            onPress: () => Keyboard.dismiss(),
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
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
            <MaterialCommunityIcons
              style={styles.saveButton}
              name="send"
              size={40}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
});

export default SettingsScreen;
