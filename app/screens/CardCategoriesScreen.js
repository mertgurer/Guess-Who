import React from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export function CardCategoriesScreen() {
  return (
    <ScrollView style={styles.cardCategories}>
      <Ionicons name="happy" size={30} color="#900" />

      <Text style={styles.text}>Hi Guys</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardCategories: {
    flex: 1,
    backgroundColor: "#121212",
  },
  text: { color: "#fff" },
});
