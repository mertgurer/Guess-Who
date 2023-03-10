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
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DataContext from "../../DataContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { strings } from "../assets/languages";

const imageMap = {
  en: require("../assets/locales/en.png"),
  tr: require("../assets/locales/tr.png"),
  es: require("../assets/locales/es.png"),
  it: require("../assets/locales/it.png"),
};

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient
        style={styles.container}
        colors={[colors.background1, colors.background2, colors.background3]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
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
                        setLanguage(key);
                        try {
                          await AsyncStorage.setItem("language", key);
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.languageBox,
                          {
                            borderColor:
                              language === key ? colors.white : colors.black,
                          },
                        ]}
                      >
                        <Image
                          style={{ width: 62, height: 62, borderRadius: 10 }}
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
            <Text style={{ fontFamily: "CentraBold", fontSize: 15 }}>
              {strings[language].deleteInfo}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "25%",
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
    fontFamily: "CentraMedium",
  },
  usernameZone: {
    flexDirection: "row",
  },
  input: {
    backgroundColor: colors.secondary,
    width: 230,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 17,
    fontFamily: "CentraBook",
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
    marginTop: 30,
  },
  languageArea: {
    width: 300,
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
