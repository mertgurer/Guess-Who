import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";

import { colors } from "../../assets/colors";
import { DataContext } from "../../../DataContext";
import { getCategoriesData } from "../../../firebase";

const Item = ({ item, navigation }) => (
  <Pressable
    onPress={() => {
      navigation.push("Cards", { title: item.title, cards: item.cards });
    }}
  >
    <View style={styles.categoryBox}>
      <Text style={styles.categoryBoxContent}>{item.title}</Text>
    </View>
  </Pressable>
);

const CardCategoriesScreen = ({ navigation }) => {
  const { categoryData, setCategoryData } = useContext(DataContext);

  const fetchCategoriesData = async () => {
    setCategoryData(await getCategoriesData());
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: categoryData === undefined ? "center" : "stretch",
      }}
    >
      {categoryData === undefined ? (
        <Text
          style={{
            fontSize: 40,
            backgroundColor: colors.black,
            color: colors.white,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.white,
          }}
        >
          Loading...
        </Text>
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
            <RefreshControl onRefresh={() => fetchCategoriesData()} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardCategories: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  categoryBox: {
    backgroundColor: colors.secondary,
    width: 170,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.white,
    marginVertical: 10,

    shadowColor: colors.black,
    shadowOpacity: 0.7,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 5 },
  },
  categoryBoxContent: { color: colors.white },
});

export default CardCategoriesScreen;
