import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { colors } from "../../assets/colors";
import DataContext from "../../../DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../assets/languages";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../../firebase";

const Item = ({ card, url, originals }) => {
  return (
    <View style={styles.cardBox}>
      <Image
        source={{ uri: url }}
        style={{ width: 184, height: 184, borderRadius: 6 }}
      />
      <Text
        style={[
          styles.cardBoxContent,
          originals
            ? {
                bottom: 5,
                color: colors.white,
                backgroundColor: "#000000b0",
                width: 190,
                fontSize: 15,
              }
            : { fontSize: 20 },
        ]}
      >
        {card}
      </Text>
    </View>
  );
};

const CardScreen = ({ route, navigation }) => {
  const { customCardsArray, setCustomCardsArray, language } =
    useContext(DataContext);
  const { title, cards, id } = route.params;
  const [urls, setUrls] = useState();

  const fetchImage = async () => {
    const storageRef = ref(storage, title);
    const allImages = await listAll(storageRef);

    const imageObjects = await Promise.all(
      allImages.items.map(async (imageRef) => {
        const object = await getDownloadURL(imageRef);
        return { [imageRef.name.split(".")[0]]: object };
      })
    );

    setUrls(Object.assign({}, ...imageObjects));
  };

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
    } else {
      fetchImage();
    }
  }, [id]);

  return urls ? (
    <FlatList
      style={styles.cards}
      data={cards}
      renderItem={({ item }) => (
        <Item card={item} url={urls[item]} originals={true} />
      )}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-evenly" }}
      contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
      keyExtractor={(index) => index.toString()}
    />
  ) : (
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
    backgroundColor: colors.third,
  },
  cardBox: {
    backgroundColor: colors.primary,
    width: 190,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
    textAlign: "center",
    fontFamily: "CentraBook",
    position: "absolute",
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
