import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";

import Ionicons from "react-native-vector-icons/Ionicons";

const PickScreen = ({ route, navigation }) => {
  const docRef = route.params?.docRef;
  const username = route.params?.username;
  const [docData, setDocData] = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setDocData(doc.data());

      if (doc.data().roomCode === -1) {
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
          await updateDoc(docRef, { roomCode: -1 });
        }}
      >
        <Ionicons name="close" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default PickScreen;

const styles = StyleSheet.create({});
