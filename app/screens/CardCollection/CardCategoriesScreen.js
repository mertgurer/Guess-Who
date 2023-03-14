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
            <Item item={item} navigation={navigation} />
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
