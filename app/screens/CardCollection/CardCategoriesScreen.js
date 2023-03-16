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
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%", borderRadius: 13 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.categoryBoxContent}>{item.title}</Text>
      )}
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
    const temp = await getCategoriesData();
    fetchImage({ data: temp });

    if (customCardsArray) {
      setCategoryData([...temp, ...customCardsArray]);
    } else {
      setCategoryData(temp);
    }
  };

  const refreshFetchCategoriesData = async () => {
    setIsRefreshing(true);

    const temp = await getCategoriesData();
    fetchImage({ data: temp });

    if (customCardsArray) {
      setCategoryData([...temp, ...customCardsArray]);
    } else {
      setCategoryData(temp);
    }

    setIsRefreshing(false);
  };

  const fetchImage = async ({ data }) => {
    const imageUrls = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].id < 100) {
        const storageRef = ref(
          storage,
          `${data[i].title}/${data[i].title}_cover.jpg`
        );

        const url = await getDownloadURL(storageRef);
        imageUrls[data[i].title] = url;
      }
    }
    setUrls(imageUrls);
  };

  useEffect(() => {
    fetchCategoriesData();
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
      {categoryData && urls ? (
        <FlatList
          style={styles.cardCategories}
          data={categoryData}
          renderItem={({ item }) => (
            <Item item={item} navigation={navigation} url={urls[item.title]} />
          )}
          contentContainerStyle={{
            paddingBottom: 30,
            paddingTop: 10,
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
      ) : (
        <ActivityIndicator color={colors.black} size="small" />
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
    borderRadius: 14,
    marginHorizontal: 5,

    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  categoryBoxContent: {
    position: "absolute",
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
});

export default CardCategoriesScreen;
