import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

import join from "../../assets/join.png";

import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { strings } from "../../assets/languages";
import { db } from "../../../firebase";

const JoinGameScreen = ({ navigation }) => {
  const { language, username } = useContext(DataContext);
  const [roomCode, setRoomCode] = useState(["", "", "", ""]);
  const [roomFound, setRoomFound] = useState(undefined);

  const handleChange = async (value, index) => {
    const newCode = [...roomCode];
    newCode[index] = value;
    setRoomCode(newCode);

    setRoomFound(
      await scanForGame({
        code: parseInt(newCode.join("")),
        setRoomFound: setRoomFound,
      })
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setRoomCode(["", "", "", ""]);
      setRoomFound(undefined);
    }, [])
  );

  const digitCount = 4;

  const focusNextInput = (index) => {
    index < digitCount - 1 && inputs[index + 1].focus();
  };

  const focusPrevInput = (index) => {
    if (index > 0) {
      const newCode = [...roomCode];
      newCode[index - 1] = "";
      setRoomCode(newCode);

      inputs[index - 1].focus();
    }
  };

  const inputs = [];

  return (
    <ImageBackground
      source={join}
      resizeMode="cover"
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: colors.primary,
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          {roomFound !== undefined && (
            <View style={styles.box}>
              <Text style={styles.headerText}>
                {strings[language].category}
              </Text>
              <Text style={styles.boxContent}>{roomFound.title}</Text>
              <Text style={styles.headerText}>
                {strings[language].createdBy}
              </Text>
              <Text style={styles.boxContent}>{roomFound.p1_name}</Text>
            </View>
          )}
          <View style={styles.box}>
            <Text style={styles.headerText}>{strings[language].codeInfo}</Text>
            {roomFound === undefined && (
              <Text
                style={[
                  styles.boxContent,
                  { fontSize: 20, marginBottom: 10, marginTop: 70 },
                ]}
              >
                {strings[language].joinInfo}
              </Text>
            )}
          </View>

          <View style={styles.inputZone}>
            {(() => {
              const digitZones = [];
              for (let index = 0; index < digitCount; index++) {
                digitZones.push(
                  <TextInput
                    key={index}
                    style={styles.roomCodeInput}
                    onChangeText={(value) => {
                      const temp = value.replace(/[^0-9]/g, "");
                      if (value === temp) {
                        handleChange(value, index);
                        value !== "" && focusNextInput(index);
                      }
                    }}
                    value={roomCode[index]}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={(input) => {
                      inputs[index] = input;
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") {
                        if (roomCode[index] === "") {
                          focusPrevInput(index);
                        }
                      }
                    }}
                  />
                );
              }

              return digitZones;
            })()}
          </View>
          <TouchableOpacity
            onPress={() => {
              if (roomFound)
                joinRoom({
                  roomCode: parseInt(roomCode.join("")),
                  username: username,
                  navigation: navigation,
                });
            }}
            activeOpacity={0.8}
          >
            <View style={styles.joinButton}>
              <Text
                style={{
                  fontFamily: "CentraBook",
                  fontSize: 22,
                  color: colors.black,
                }}
              >
                {strings[language].join}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default JoinGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  headerText: {
    fontSize: 32,
    fontFamily: "CentraMedium",
    color: colors.white,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
  boxContent: {
    fontFamily: "CentraBook",
    fontSize: 25,
    color: colors.halfWhite,
    marginTop: 2,
    marginBottom: 30,
    textAlign: "center",
  },
  inputZone: {
    flexDirection: "row",
    gap: 10,
  },
  roomCodeInput: {
    width: 30,
    fontSize: 35,
    textAlign: "center",
    fontFamily: "CentraBook",
    color: colors.halfWhite,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
    marginTop: 2,
    marginBottom: 50,
  },
  joinButton: {
    width: 220,
    height: 55,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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

  const docRef = querySnapshot.docs[0].ref;
  const doc = await getDoc(docRef);

  unsubscribe();
  await updateDoc(docRef, { p2_name: username });
  navigation.push("PickCard", {
    docRef: docRef,
    p1orp2: "p2",
    title: doc.data().title,
  });
};
