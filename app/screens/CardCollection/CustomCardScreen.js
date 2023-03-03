import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { colors } from "../../assets/colors";
import DataContext from "../../../DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { async } from "@firebase/util";

const CustomCardScreen = ({ navigation }) => {
  const { customCardsArray, setCustomCardsArray } = useContext(DataContext);
  const [cardCount, setCardCount] = useState(4);
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
              header: "Save Failed",
              message: `A card set with the name "${tempCardSet.title}" already exists`,
            });
            uniqueFlag = false;
            break;
          }
        }
        // if fisrts set title is unique add it to the array
        if (uniqueFlag) {
          successAlert({ title: tempCardSet.title, navigation: navigation });
          setCustomCardsArray([...customCardsArray, tempCardSet]);
          saveCardState({
            customCardsArray: [...customCardsArray, tempCardSet],
          });
        }
      }
      // if there is no other card sets add this one
      else {
        successAlert({ title: tempCardSet.title, navigation: navigation });
        setCustomCardsArray([tempCardSet]);
        saveCardState({ customCardsArray: [tempCardSet] });
      }
    }
    // if field values are not validated
    else if (tempCardSet.title.length === 0) {
      failAlert({
        header: "Can't Save",
        message: `Title field can not be empty`,
      });
    } else {
      failAlert({
        header: "Can't Save",
        message: `There must be at least 2 card fields`,
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 120 }}
      >
        <TextInput
          style={[styles.input, styles.titleInput]}
          value={customCards.title}
          onChangeText={(text) =>
            setCustomCards({ ...customCards, title: text })
          }
          placeholder={"Title"}
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
                    placeholder={"Name"}
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
                    placeholder={"Name"}
                    placeholderTextColor={colors.halfBlack}
                  />
                );
              }
              return elements;
            })()}
          </View>
        </View>
      </ScrollView>
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
        >
          <FontAwesome name="minus" size={40} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSubmit}
        >
          <FontAwesome name="save" size={45} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.plusButton]}
          onPress={() => {
            console.log(customCardsArray);
            setCardCount(cardCount + 1);
          }}
        >
          <FontAwesome name="plus" size={40} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
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
    borderWidth: 1,
    borderColor: colors.white,
  },
  buttonArea: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-evenly",
  },
  button: {
    width: 100,
    height: 60,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: { backgroundColor: colors.third },
  minuesButton: { backgroundColor: colors.third },
  plusButton: { backgroundColor: colors.third },
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

const successAlert = ({ title, navigation }) => {
  Alert.alert(
    "Save Successful",
    `New card set "${title}" is added to the collection`,
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
