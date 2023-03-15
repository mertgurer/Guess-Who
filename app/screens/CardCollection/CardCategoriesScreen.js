import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";

import { colors } from "../../assets/colors";
import { DataContext } from "../../../DataContext";
import { getCategoriesData, storage } from "../../../firebase";
import { useFocusEffect } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";

const Item = ({ item, navigation, url }) => (
  <Pressable
    onPress={() => {
      navigation.push("Cards", {
        title: item.title,
        cards: item.cards,
        id: item.id,
      });
    }}
  >
    <View style={styles.categoryBox}>
      <Image
        source={{ uri: url }}
        style={{
          width: 184,
          height: 184,
          borderRadius: 6,
          position: "absolute",
        }}
      />
      <Text style={styles.categoryBoxContent}>{item.title}</Text>
    </View>
  </Pressable>
);

const CardCategoriesScreen = ({ navigation }) => {
  const { categoryData, setCategoryData, customCardsArray } =
    useContext(DataContext);

  const [isFocused, setIsFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [urls, setUrls] = useState();

  const fetchCategoriesData = async () => {
    temp = await getCategoriesData();
    if (customCardsArray) {
      setCategoryData([...temp, ...customCardsArray]);
    } else {
      setCategoryData(temp);
    }
    fetchImage({ data: temp });
  };

  const refreshFetchCategoriesData = async () => {
    setIsRefreshing(true);

    temp = await getCategoriesData();
    if (customCardsArray) {
      setCategoryData([...temp, ...customCardsArray]);
    } else {
      setCategoryData(temp);
    }
    fetchImage({ data: temp });

    setIsRefreshing(false);
  };

  const fetchImage = async ({ data }) => {
    const imageUrls = {};
    for (let i = 0; i < 1 /*  data.length */; i++) {
      if (data[i].id < 100) {
        const storageRef = ref(
          storage,
          `${data[i].title}/${data[i].title}.png`
        );

        const url = await getDownloadURL(storageRef);
        imageUrls[data[i].title] = url;
      }
    }
    setUrls(imageUrls);
  };

  useEffect(() => {
    fetchCategoriesData();

    console.log(urls);
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.third,
      }}
    >
      {!categoryData ? (
        <ActivityIndicator color={colors.white} size="large" />
      ) : (
        <FlatList
          style={styles.cardCategories}
          data={categoryData}
          renderItem={({ item }) => (
            <Item item={item} navigation={navigation} url={urls[item.title]} />
          )}
          contentContainerStyle={{
            paddingBottom: 30,
            paddingTop: 20,
            paddingHorizontal: 10,
            gap: 10,
          }}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refreshFetchCategoriesData()}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardCategories: {
    flex: 1,
  },
  categoryBox: {
    backgroundColor: colors.fourth,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 5,

    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  categoryBoxContent: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
});

export default CardCategoriesScreen;
