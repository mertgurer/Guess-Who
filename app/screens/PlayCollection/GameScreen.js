import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { deleteDoc } from "firebase/firestore";

const GameScreen = ({ route, navigation }) => {
  const docRef = route.params?.docRef;

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text>GameScreen</Text>
      <TouchableOpacity
        onPress={() => {
          deleteDoc(docRef);
          navigation.navigate("Home");
        }}
      >
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({});
