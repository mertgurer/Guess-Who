import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";

import Ionicons from "react-native-vector-icons/Ionicons";
import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";

const PickScreen = ({ route, navigation }) => {
  const { language } = useContext(DataContext);
  const docRef = route.params?.docRef;
  const username = route.params?.username;
  const [docData, setDocData] = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setDocData(doc.data());

      if (doc.data().roomCode === -1 && doc.data().p2_name === username) {
        Alert.alert(
          strings[language].gameAborted,
          strings[language].oponentLeft
        );

        unsubscribe();
        deleteDoc(docRef);
        navigation.goBack();
      } else if (
        doc.data().roomCode === -2 &&
        doc.data().p1_name === username
      ) {
        Alert.alert(
          strings[language].gameAborted,
          strings[language].oponentLeft
        );

        unsubscribe();
        deleteDoc(docRef);
        navigation.goBack();
      } else if (doc.data().roomCode === -1 || doc.data().roomCode === -2) {
        unsubscribe();
        deleteDoc(docRef);
        navigation.goBack();
      }
    });
    return unsubscribe;
  }, []);

  if (!docData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>{docData.title}</Text>
      <TouchableOpacity
        onPress={async () => {
          if (docData.p1_name === username) {
            await updateDoc(docRef, { roomCode: -1 });
          } else {
            await updateDoc(docRef, { roomCode: -2 });
          }
        }}
      >
        <Ionicons name="close" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default PickScreen;

const styles = StyleSheet.create({});
