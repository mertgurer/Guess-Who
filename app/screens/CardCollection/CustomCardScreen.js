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

import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

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

    // validate new card set
    if (filteredTitle.length !== 0 && filteredCrads.length >= 2) {
      if (customCardsArray) {
        let uniqueFlag = true;

        // check the saved sets for title match
        for (let i = 0; i < customCardsArray.length; i++) {
          if (filteredTitle === customCardsArray[i].title) {
            failAlert({
              header: strings[language].saveFail,
              message: `${strings[language].saveFailInfo1} "${filteredTitle}" ${strings[language].saveFailInfo2}`,
            });
            uniqueFlag = false;
            break;
          }
        }
        // if first set title is unique add it to the array
        if (uniqueFlag) {
          const id = customCardsArray[customCardsArray.length - 1].id + 1;

          const tempCardSet = {
            title: filteredTitle,
            cards: filteredCrads,
            id: id,
          };
          successAlert({
            title: filteredTitle,
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
        const tempCardSet = {
          title: filteredTitle,
          cards: filteredCrads,
          id: 100,
        };

        successAlert({
          title: filteredTitle,
          navigation: navigation,
          language,
        });
        setCustomCardsArray([tempCardSet]);
        saveCardState({ customCardsArray: [tempCardSet] });
      }
    }
    // if field values are not validated
    else if (filteredTitle.length === 0) {
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
        style={{ flex: 1 }}
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
          <AntDesign name="minuscircleo" size={35} color={colors.third} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Ionicons
            name="save-sharp"
            size={40}
            color={colors.third}
            style={{ left: 1 }}
          />
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
          <AntDesign
            name="pluscircleo"
            size={35}
            color={colors.third}
            style={{ left: 1 }}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.third,
  },
  titleInput: {
    width: "85%",
    marginVertical: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
  fieldsContainer: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldColumn: {
    width: "47%",
    alignItems: "center",
  },
  input: {
    backgroundColor: colors.white,
    width: "100%",
    height: 50,
    marginVertical: 5,
    borderRadius: 3,
    paddingHorizontal: 10,
    fontSize: 17,
    borderWidth: 1,
    borderColor: colors.halfWhite,
    fontFamily: "CentraBook",
  },
  buttonArea: {
    position: "absolute",
    bottom: 40,
    width: "70%",
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: "15%",
    justifyContent: "space-evenly",
  },
  button: {
    width: 100,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
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
