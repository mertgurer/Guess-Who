import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";

import Foundation from "react-native-vector-icons/Foundation";
import Fontisto from "react-native-vector-icons/Fontisto";

import { colors } from "../../assets/colors";
import DataContext from "../../../DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../assets/languages";
import { LinearGradient } from "expo-linear-gradient";

const CustomCardScreen = ({ navigation }) => {
  const { customCardsArray, setCustomCardsArray, language } =
    useContext(DataContext);
  const [cardCount, setCardCount] = useState(6);
  const [customCards, setCustomCards] = useState({
    title: "",
    cards: [],
  });

  // auto upadte for the input fields
  const handleChangeText = (text, index) => {
    const newCards = [...customCards.cards];
    newCards[index] = text;
    setCustomCards({ ...customCards, cards: newCards });
  };

  // handle the submition of new card set
  const handleSubmit = () => {
    // filter the input values
    const filteredCrads = customCards.cards.filter(
      (card) => card !== undefined && card.length !== 0
    );
    const filteredTitle = customCards.title.trim();

    // save them in a temp card set
    let id = 100;
    if (customCardsArray) {
      id += customCardsArray.length;
    }

    const tempCardSet = {
      title: filteredTitle,
      cards: filteredCrads,
      id: id,
    };

    // validate new card set
    if (tempCardSet.title.length !== 0 && tempCardSet.cards.length >= 2) {
      if (customCardsArray) {
        let uniqueFlag = true;

        // check the saved sets for title match
        for (let i = 0; i < customCardsArray.length; i++) {
          if (tempCardSet.title === customCardsArray[i].title) {
            failAlert({
              header: strings[language].saveFail,
              message: `${strings[language].saveFailInfo1} "${tempCardSet.title}" ${strings[language].saveFailInfo2}`,
            });
            uniqueFlag = false;
            break;
          }
        }
        // if fisrts set title is unique add it to the array
        if (uniqueFlag) {
          successAlert({
            title: tempCardSet.title,
            navigation: navigation,
            language,
          });
          setCustomCardsArray([...customCardsArray, tempCardSet]);
          saveCardState({
            customCardsArray: [...customCardsArray, tempCardSet],
          });
        }
      }
      // if there is no other card sets add this one
      else {
        successAlert({
          title: tempCardSet.title,
          navigation: navigation,
          language,
        });
        setCustomCardsArray([tempCardSet]);
        saveCardState({ customCardsArray: [tempCardSet] });
      }
    }
    // if field values are not validated
    else if (tempCardSet.title.length === 0) {
      failAlert({
        header: strings[language].cantSave,
        message: strings[language].cantSaveEmpty,
      });
    } else {
      failAlert({
        header: strings[language].cantSave,
        message: strings[language].cantSaveLittle,
      });
    }

    // update the form with the filtered data
    setCustomCards({
      ...customCards,
      cards: filteredCrads,
      title: filteredTitle,
    });
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background1, colors.background2, colors.background3]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
        >
          <TextInput
            style={[styles.input, styles.titleInput]}
            value={customCards.title}
            onChangeText={(text) =>
              setCustomCards({ ...customCards, title: text })
            }
            placeholder={strings[language].title}
            placeholderTextColor={colors.halfBlack}
          />

          <View style={styles.fieldsContainer}>
            <View style={styles.fieldColumn}>
              {(() => {
                const elements = [];
                for (let index = 0; index < cardCount; index += 2) {
                  elements.push(
                    <TextInput
                      key={index}
                      style={styles.input}
                      value={customCards.cards[index]}
                      onChangeText={(text) => handleChangeText(text, index)}
                      placeholder={strings[language].name}
                      placeholderTextColor={colors.halfBlack}
                    />
                  );
                }
                return elements;
              })()}
            </View>

            <View style={styles.fieldColumn}>
              {(() => {
                const elements = [];
                for (let index = 1; index < cardCount; index += 2) {
                  elements.push(
                    <TextInput
                      key={index}
                      style={styles.input}
                      value={customCards.cards[index]}
                      onChangeText={(text) => handleChangeText(text, index)}
                      placeholder={strings[language].name}
                      placeholderTextColor={colors.halfBlack}
                    />
                  );
                }
                return elements;
              })()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, styles.minuesButton]}
          onPress={() => {
            if (cardCount > 2) {
              setCardCount(cardCount - 1);
              const cutCards = customCards.cards;
              cutCards.splice(cardCount - 1);
              setCustomCards({ ...customCards, cards: cutCards });
            }
          }}
          activeOpacity={0.8}
        >
          <Foundation name="minus" size={30} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Fontisto name="save" size={37} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.plusButton]}
          onPress={() => {
            if (cardCount < 30) {
              setCardCount(cardCount + 1);
            }
          }}
          activeOpacity={0.8}
        >
          <Foundation name="plus" size={35} color={colors.black} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.primary,
  },
  titleInput: {
    width: 200,
    marginVertical: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
  fieldsContainer: {
    width: "90%",
    flexDirection: "row",
  },
  fieldColumn: {
    width: "50%",
    alignItems: "center",
  },
  input: {
    backgroundColor: colors.secondary,
    width: 170,
    height: 50,
    marginVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 17,
    borderWidth: 2,
    borderColor: colors.black,
    fontFamily: "CentraBook",
  },
  buttonArea: {
    position: "absolute",
    bottom: 40,
    width: "60%",
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: "20%",
    justifyContent: "space-evenly",
  },
  button: {
    width: 100,
    height: 60,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.third,
  },
  minuesButton: { width: 60 },
  plusButton: { width: 60 },
});

export default CustomCardScreen;

const saveCardState = async ({ customCardsArray }) => {
  try {
    const jsonValue = JSON.stringify(customCardsArray);
    await AsyncStorage.setItem("customCards", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const successAlert = ({ title, navigation, language }) => {
  Alert.alert(
    strings[language].saveSuccessful,
    `${strings[language].saveInfo1} "${title}" ${strings[language].saveInfo2}`,
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]
  );
};

const failAlert = ({ header, message }) => {
  Alert.alert(header, message);
};
