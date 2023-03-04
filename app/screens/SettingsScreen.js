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
import { strings } from "../assets/languages";

const SettingsScreen = () => {
  const { username, setUsername, setCustomCardsArray, language, setLanguage } =
    useContext(DataContext);
  const [input, setInput] = useState(username);

  const submitUsername = async () => {
    filteredInput = input.trim();

    try {
      if (filteredInput !== username && filteredInput.length !== 0) {
        setUsername(filteredInput);
        await AsyncStorage.setItem("username", filteredInput);
        successAlert({ newUsername: filteredInput, language: language });
      } else if (filteredInput === username) {
        failAlert({
          message: strings[language].sameUsername,
          language: language,
        });
      } else {
        failAlert({
          message: strings[language].emptyUsername,
          language: language,
        });
      }
    } catch (e) {
      console.log(e);
    }

    setInput(filteredInput);
  };

  return (
    <ImageBackground style={styles.container} source={backImage}>
      <View style={styles.settings}>
        <View>
          <Text style={styles.infoText}>{strings[language].username}</Text>
          <View style={styles.usernameZone}>
            <TextInput
              style={styles.input}
              onChangeText={setInput}
              value={input}
              placeholder={strings[language].usernamePlaceholder}
            />
            <TouchableOpacity onPress={submitUsername} activeOpacity={0.8}>
              <View style={styles.saveButton}>
                <Ionicons
                  name="checkmark-sharp"
                  size={50}
                  color={colors.black}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.languageZone}>
          <Text style={styles.infoText}>{strings[language].languages}</Text>
          <View style={styles.languageArea}>
            {(() => {
              const languageButtons = [];

              for (const key in strings) {
                languageButtons.push(
                  <TouchableOpacity
                    key={key}
                    onPress={async () => {
                      setLanguage(key);
                      try {
                        await AsyncStorage.setItem("language", key);
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.languageBox}>
                      <Text>{key.toUpperCase()}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              return languageButtons;
            })()}
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center" }}
        onPress={() =>
          deleteAlert({
            setCustomCardsArray: setCustomCardsArray,
            language: language,
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.clearCustomCards}>
          <Text style={{ fontWeight: "700" }}>
            {strings[language].deleteInfo}
          </Text>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "30%",
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  settings: {
    flex: 2,
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
  languageZone: {
    marginTop: 20,
  },
  languageArea: {
    width: 290,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  languageBox: {
    backgroundColor: colors.secondary,
    width: 65,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
  },
  clearCustomCards: {
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

const successAlert = ({ newUsername, language }) => {
  Alert.alert(
    strings[language].changeSuccessful,
    `${strings[language].newUsernameInfo} ${newUsername}`,
    [
      {
        text: strings[language].ok,
        onPress: () => Keyboard.dismiss(),
      },
    ]
  );
};

const failAlert = ({ message, language }) => {
  Alert.alert(strings[language].changeFailed, message, [
    {
      text: strings[language].ok,
    },
  ]);
};

const deleteAlert = ({ setCustomCardsArray, language }) => {
  Alert.alert(strings[language].deleteWarning, "", [
    {
      text: strings[language].delete,
      style: "destructive",
      onPress: () => {
        saveCardState();
        setCustomCardsArray(undefined);
      },
    },
    {
      text: strings[language].cancel,
      style: "cancel",
    },
  ]);
};
