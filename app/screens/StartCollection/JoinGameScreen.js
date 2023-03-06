import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";

import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { strings } from "../../assets/languages";
import { db } from "../../../firebase";

const JoinGameScreen = ({ navigation }) => {
  const { language, username } = useContext(DataContext);
  const [roomCode, setRoomCode] = useState();
  const [roomFound, setRoomFound] = useState(undefined);

  const handleChange = async (text) => {
    const inputValue = text.replace(/[^0-9]/g, "");

    setRoomCode(inputValue);
    setRoomFound(
      await scanForGame({
        code: parseInt(inputValue),
        setRoomFound: setRoomFound,
      })
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setRoomCode("");
      setRoomFound(undefined);
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient
        style={styles.container}
        colors={[colors.background1, colors.background2, colors.background3]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>{strings[language].codeInfo}</Text>
        </View>

        {roomFound !== undefined && (
          <View style={styles.foundGameBox}>
            <Text style={styles.foundGameBoxHeader}>
              {strings[language].category}
            </Text>
            <Text style={styles.foundGameBoxContent}>{roomFound.title}</Text>
            <Text style={styles.foundGameBoxHeader}>
              {strings[language].codeInfo}
            </Text>
            <Text style={styles.foundGameBoxContent}>{roomCode}</Text>
            <Text style={styles.foundGameBoxHeader}>
              {strings[language].createdBy}
            </Text>
            <Text style={styles.foundGameBoxContent}>{roomFound.p1_name}</Text>
          </View>
        )}

        <TextInput
          style={styles.roomCodeInput}
          onChangeText={handleChange}
          value={roomCode}
          placeholder={strings[language].codeInfo}
          keyboardType="numeric"
          maxLength={4}
        />
        <TouchableOpacity
          onPress={() => {
            if (roomFound)
              joinRoom({
                roomCode: parseInt(roomCode),
                username: username,
                navigation: navigation,
              });
          }}
          activeOpacity={0.8}
        >
          <View style={styles.joinButton}>
            <Ionicons name="arrow-forward" size={50} color={colors.black} />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default JoinGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: 200,
    height: 60,
    backgroundColor: colors.third,
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 30,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "CentraBook",
  },
  foundGameBox: {
    backgroundColor: colors.secondary,
    width: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.black,
    padding: 20,
    marginBottom: 20,
  },
  foundGameBoxHeader: {
    fontFamily: "CentraBook",
    fontSize: 15,
  },
  foundGameBoxContent: {
    fontFamily: "CentraBook",
    fontSize: 30,
    marginBottom: 15,
    marginLeft: 7,
  },
  roomCodeInput: {
    backgroundColor: colors.secondary,
    width: 220,
    height: 60,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
  joinButton: {
    width: 220,
    height: 60,
    backgroundColor: colors.third,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 0,
  },
});

let unsubscribe = null;

const scanForGame = async ({ code, setRoomFound }) => {
  if (isNaN(code) || code < 1000) return undefined;

  const gamesRef = collection(db, "Games");

  const q = query(gamesRef, where("roomCode", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    for (const doc of querySnapshot.docs) {
      if (doc.data().p2_name === "notSet") {
        const docRef = doc.ref;

        unsubscribe = onSnapshot(docRef, (doc) => {
          if (!doc.data()) {
            unsubscribe();
            setRoomFound(undefined);
          }
        });

        return doc.data();
      }
    }
  }

  return undefined;
};

const joinRoom = async ({ roomCode, username, navigation }) => {
  const gamesRef = collection(db, "Games");

  const q = query(gamesRef, where("roomCode", "==", roomCode));
  const querySnapshot = await getDocs(q);

  try {
    const docRef = querySnapshot.docs[0].ref;

    unsubscribe();
    await updateDoc(docRef, { p2_name: username });
    navigation.push("PickCard", { docRef: docRef, username: username });
  } catch (e) {
    console.error(e);
  }
};
