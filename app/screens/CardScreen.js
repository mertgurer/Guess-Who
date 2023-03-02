import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";

import { colors } from "../assets/colors";

const Item = ({ card }) => (
  <View style={styles.cardBox}>
    <Text style={styles.cardBoxContent}>{card}</Text>
  </View>
);

export function CardScreen({ route }) {
  const { cards } = route.params;

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
}

const styles = StyleSheet.create({
  cards: {
    backgroundColor: colors.primary,
  },
  cardBox: {
    backgroundColor: colors.tint,
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
  cardBoxContent: { color: colors.white },
});

export default CardScreen;
