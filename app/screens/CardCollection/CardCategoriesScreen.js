import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../assets/colors";
import { DataContext } from "../../../DataContext";
import { getCategoriesData } from "../../../firebase";
import { useFocusEffect } from "@react-navigation/native";

const Item = ({ item, navigation }) => (
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
      <Text style={styles.categoryBoxContent}>{item.title}</Text>
    </View>
  </Pressable>
);

const CardCategoriesScreen = ({ navigation }) => {
  const { categoryData, setCategoryData, customCardsArray } =
    useContext(DataContext);

  const [isFocused, setIsFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCategoriesData = async () => {
    if (customCardsArray) {
      setCategoryData([...(await getCategoriesData()), ...customCardsArray]);
    } else {
      setCategoryData(await getCategoriesData());
    }
  };

  const refreshFetchCategoriesData = async () => {
    setIsRefreshing(true);

    if (customCardsArray) {
      setCategoryData([...(await getCategoriesData()), ...customCardsArray]);
    } else {
      setCategoryData(await getCategoriesData());
    }

    setIsRefreshing(false);
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
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: "center",
      }}
      colors={[colors.background1, colors.background2, colors.background3]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {!categoryData ? (
        <ActivityIndicator color={colors.white} size="large" />
      ) : (
        <FlatList
          style={styles.cardCategories}
          data={categoryData}
          renderItem={({ item }) => (
            <Item item={item} navigation={navigation} />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-evenly" }}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refreshFetchCategoriesData()}
            />
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardCategories: {
    flex: 1,
  },
  categoryBox: {
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
  categoryBoxContent: {
    color: colors.black,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
});

export default CardCategoriesScreen;
