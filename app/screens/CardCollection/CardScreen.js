import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { colors } from "../../assets/colors";
import DataContext from "../../../DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../assets/languages";

const Item = ({ card }) => (
  <View style={styles.cardBox}>
    <Text style={styles.cardBoxContent}>{card}</Text>
  </View>
);

const CardScreen = ({ route, navigation }) => {
  const { customCardsArray, setCustomCardsArray, language } =
    useContext(DataContext);
  const { title, cards, id } = route.params;

  useEffect(() => {
    if (id > 99) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              deleteAlert({
                title: title,
                customCardsArray: customCardsArray,
                setCustomCardsArray: setCustomCardsArray,
                navigation: navigation,
                language: language,
              })
            }
          >
            <Ionicons name="trash-outline" size={30} color={colors.white} />
          </TouchableOpacity>
        ),
      });
    }
  }, [id]);

  return (
    <FlatList
      style={styles.cards}
      data={cards}
      renderItem={({ item }) => <Item card={item} />}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-evenly" }}
      contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
      keyExtractor={(index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  cardBox: {
    backgroundColor: colors.secondary,
    width: 170,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.black,
    marginVertical: 10,
    padding: 5,

    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  cardBoxContent: {
    color: colors.black,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
});

export default CardScreen;

const deleteAlert = ({
  title,
  customCardsArray,
  setCustomCardsArray,
  navigation,
  language,
}) => {
  Alert.alert(
    `${strings[language].delete} "${title}"`,
    strings[language].deleteSet,
    [
      {
        text: strings[language].cancel,
        style: "cancel",
      },
      {
        text: strings[language].delete,
        style: "destructive",
        onPress: async () => {
          const removedCustomCards = customCardsArray.filter(
            (category) => category.title !== title
          );

          try {
            const jsonValue = JSON.stringify(removedCustomCards);
            await AsyncStorage.setItem("customCards", jsonValue);
            setCustomCardsArray(removedCustomCards);
            navigation.goBack();
          } catch (e) {
            console.log(e);
          }
        },
      },
    ]
  );
};
