import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../assets/colors";
import DataContext from "../../DataContext";
import { strings } from "../assets/languages";

const imageMap = {
  en: require("../assets/locales/en.png"),
  tr: require("../assets/locales/tr.png"),
  es: require("../assets/locales/es.png"),
  it: require("../assets/locales/it.png"),
  fr: require("../assets/locales/fr.png"),
  de: require("../assets/locales/de.png"),
};

const SettingsScreen = () => {
  const { username, setUsername, setCustomCardsArray, language, setLanguage } =
    useContext(DataContext);
  const [input, setInput] = useState(username);
  const [languageIndex, setLanguageIndex] = useState(language);

  const saveSettings = async () => {
    filteredInput = input.trim();

    try {
      if (filteredInput !== username && filteredInput.length !== 0) {
        setUsername(filteredInput);
        await AsyncStorage.setItem("username", filteredInput);
        successAlert({ newUsername: filteredInput, language: language });
      } else if (filteredInput.length === 0) {
        failAlert({
          message: strings[language].emptyUsername,
          language: language,
        });
      }
    } catch (e) {
      console.log(e);
    }

    setInput(filteredInput);

    setLanguage(languageIndex);
    try {
      await AsyncStorage.setItem("language", languageIndex);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
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
            </View>
          </View>
          <View>
            <Text style={[styles.infoText, { paddingBottom: 15 }]}>
              {strings[language].languages}
            </Text>
            <View style={styles.languageArea}>
              {(() => {
                const languageButtons = [];

                for (const key in strings) {
                  languageButtons.push(
                    <TouchableOpacity
                      key={key}
                      onPress={async () => {
                        setLanguageIndex(key);
                      }}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.languageBox,
                          {
                            borderColor:
                              languageIndex === key
                                ? colors.black
                                : colors.third,
                          },
                        ]}
                      >
                        <Image
                          style={{ width: 61, height: 61, borderRadius: 8 }}
                          source={imageMap[key]}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }

                return languageButtons;
              })()}
            </View>
          </View>
        </View>
        <View style={styles.buttonZone}>
          <TouchableOpacity onPress={saveSettings} activeOpacity={0.8}>
            <View style={styles.saveButton}>
              <Text
                style={{
                  fontFamily: "CentraBold",
                  fontSize: 22,
                  color: colors.third,
                }}
              >
                {strings[language].save}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() =>
              deleteAlert({
                setCustomCardsArray: setCustomCardsArray,
                language: language,
              })
            }
            activeOpacity={0.8}
          >
            <View>
              <Text
                style={{
                  fontFamily: "CentraBook",
                  fontSize: 15,
                  color: colors.black,
                  opacity: 0.3,
                }}
              >
                {strings[language].deleteInfo}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.third,
  },
  settings: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  infoText: {
    fontSize: 20,
    padding: 5,
    color: colors.black,
    fontFamily: "CentraMedium",
  },
  usernameZone: {
    flexDirection: "row",
  },
  input: {
    width: 300,
    padding: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: colors.halfWhite,
    backgroundColor: colors.white,
    borderRadius: 3,
    fontSize: 17,
    fontFamily: "CentraBook",
  },
  languageArea: {
    width: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 13,
    justifyContent: "center",
  },
  languageBox: {
    backgroundColor: colors.secondary,
    width: 65,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,

    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonZone: {
    flex: 1,
    alignItems: "center",
    gap: 30,
  },
  saveButton: {
    width: 220,
    height: 55,
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
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
      text: strings[language].cancel,
      style: "cancel",
    },
    {
      text: strings[language].delete,
      style: "destructive",
      onPress: () => {
        saveCardState();
        setCustomCardsArray(undefined);
      },
    },
  ]);
};
