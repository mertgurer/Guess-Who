import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";

const PickScreen = ({ route, navigation }) => {
  const { language, username } = useContext(DataContext);
  const docRef = route.params?.docRef;
  const [docData, setDocData] = useState();
  const [pick, setPick] = useState(-1);
  const [opponentName, setOpponentName] = useState();
  const [playerPick, setPlayerPick] = useState(-1);
  const [opponentPicked, setOponenPicked] = useState(false);
  const [turn, setTurn] = useState(0);
  const [disbaleStart, setDisableStart] = useState(false);

  const p1orp2 = route.params.p1orp2;

  useEffect(() => {
    const backAction = async () => {
      if (p1orp2 === "p1") {
        await updateDoc(docRef, { roomCode: -1 });
      } else {
        await updateDoc(docRef, { roomCode: -2 });
      }
      return true;
    };

    const unsubscribe = onSnapshot(docRef, (doc) => {
      setDocData(doc.data());

      // check for player names
      if (p1orp2 === "p1") {
        setOpponentName(doc.data().p2_name);
        doc.data().p2_pick !== "notSet" && setOponenPicked(true);
      } else {
        setOpponentName(doc.data().p1_name);
        doc.data().p1_pick !== "notSet" && setOponenPicked(true);
      }

      // check for room code change
      if (doc.data().roomCode === -1 && doc.data().p2_name === username) {
        Alert.alert(
          strings[language].gameAborted,
          strings[language].opponentLeft,
          [{ text: strings[language].ok }]
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
          strings[language].opponentLeft,
          [{ text: strings[language].ok }]
        );
        unsubscribe();
        deleteDoc(docRef);
        navigation.goBack();
      } else if (doc.data().roomCode === -1 || doc.data().roomCode === -2) {
        unsubscribe();
        deleteDoc(docRef);
        navigation.goBack();
      }

      // check for turn change
      if (doc.data().turn !== "notSet") {
        navigation.navigate("GameScreen", {
          docRef: docRef,
          p1orp2: p1orp2,
        });
      }
    });

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={async () => {
            if (docData.p1_name === username) {
              await updateDoc(docRef, { roomCode: -1 });
            } else {
              await updateDoc(docRef, { roomCode: -2 });
            }
          }}
        >
          <Ionicons name="close" size={35} color={colors.white} />
        </TouchableOpacity>
      ),
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: colors.white,
                marginRight: 5,
                fontFamily: "CentraBook",
                fontSize: 13,
              }}
            >
              {opponentName}
            </Text>
            {opponentPicked ? (
              <Ionicons
                name="checkmark-circle-outline"
                size={25}
                color={colors.white}
              />
            ) : (
              <Ionicons
                name="close-circle-outline"
                size={25}
                color={colors.white}
              />
            )}
          </View>
        );
      },
    });
  }, [navigation, docData, docRef, username, opponentName, opponentPicked]);

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background1, colors.background2, colors.background3]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {!docData ? (
        <ActivityIndicator color={colors.white} size="large" />
      ) : (
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <FlatList
            style={styles.cards}
            data={docData.cards}
            renderItem={({ item, index }) => (
              <Item
                card={item}
                index={index}
                pick={pick}
                setPick={setPick}
                playerPick={playerPick}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 10 }}
            keyExtractor={(index) => index.toString()}
          />
          <View style={styles.buttonArea}>
            {p1orp2 === "p1" && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (turn === 2) {
                    setTurn(0);
                  } else {
                    setTurn(turn + 1);
                  }
                }}
                activeOpacity={0.8}
              >
                {turn === 0 ? (
                  <FontAwesome
                    name="random"
                    size={30}
                    color={colors.white}
                    style={{ marginTop: 3, marginLeft: 1 }}
                  />
                ) : turn === 1 ? (
                  <Text style={styles.turnText}>P1</Text>
                ) : (
                  <Text style={styles.turnText}>P2</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() =>
                handleLockIn({
                  docRef,
                  docData,
                  pick,
                  p1orp2,
                  playerPick,
                  setPlayerPick,
                  language,
                })
              }
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 25,
                  fontFamily: "CentraBook",
                }}
              >
                {strings[language].lockIn}
              </Text>
            </TouchableOpacity>
            {p1orp2 === "p1" && (
              <TouchableOpacity
                style={styles.button}
                disabled={disbaleStart}
                onPress={() =>
                  handleStartGame({
                    docRef: docRef,
                    turn: turn,
                    playerPick: playerPick,
                    opponentPicked: opponentPicked,
                    p1orp2: p1orp2,
                    language: language,
                    setDisableStart: setDisableStart,
                    navigation: navigation,
                  })
                }
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="arrow-right"
                  size={30}
                  color={colors.white}
                  style={{ marginLeft: 4, marginBottom: 2 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

export default PickScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cards: {
    flex: 1,
    width: "100%",
  },
  cardBox: {
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
  activeCard: {
    borderColor: colors.white,
  },
  pickedCard: {
    borderColor: "red",
  },
  cardBoxContent: {
    color: colors.black,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
  buttonArea: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
  },
  confirmButton: {
    width: 150,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.white,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },
  turnText: {
    color: colors.white,
    fontSize: 30,
    fontFamily: "CentraBold",
  },
  startButton: {},
});

const Item = ({ card, index, pick, setPick, playerPick }) => (
  <TouchableOpacity
    onPress={() => {
      setPick(index);
    }}
    activeOpacity={0.8}
  >
    <View
      style={[
        styles.cardBox,
        pick === index && styles.activeCard,
        playerPick === index && styles.pickedCard,
      ]}
    >
      <Text style={styles.cardBoxContent}>{card}</Text>
    </View>
  </TouchableOpacity>
);

const handleLockIn = async ({
  docRef,
  docData,
  pick,
  p1orp2,
  playerPick,
  setPlayerPick,
  language,
}) => {
  if (playerPick !== -1) {
    Alert.alert(
      strings[language].alreadyCard,
      strings[language].alreadyCardInfo,
      [{ text: strings[language].ok }]
    );
    return;
  } else if (pick === -1) {
    Alert.alert(strings[language].noCard, strings[language].noCardInfo, [
      { text: strings[language].ok },
    ]);
    return;
  }

  Alert.alert(
    `${strings[language].lockIn} "${docData.cards[pick]}"`,
    strings[language].lockInInfo,
    [
      {
        text: strings[language].cancel,
        style: "cancel",
      },
      {
        text: strings[language].ok,
        style: "ok",
        onPress: async () => {
          setPlayerPick(pick);

          if (p1orp2 === "p1") {
            await updateDoc(docRef, { p1_pick: docData.cards[pick] });
          } else {
            await updateDoc(docRef, { p2_pick: docData.cards[pick] });
          }
        },
      },
    ]
  );
};

const handleStartGame = async ({
  docRef,
  turn,
  playerPick,
  opponentPicked,
  p1orp2,
  language,
  setDisableStart,
  navigation,
}) => {
  if (playerPick === -1) {
    Alert.alert(strings[language].noCard, strings[language].noCardLockInfo, [
      { text: strings[language].ok },
    ]);
  } else if (!opponentPicked) {
    Alert.alert(
      strings[language].noCard,
      strings[language].noCardLockOpponentInfo,
      [{ text: strings[language].ok }]
    );
  } else {
    setDisableStart(true);

    let firstMove;
    if (turn === 0) {
      temp = Math.floor(Math.random() * 2) + 1;
      firstMove = temp === 1 ? "P1" : "P2";
    } else if (turn === 1) {
      firstMove = "P1";
    } else {
      firstMove = "P2";
    }
    await updateDoc(docRef, { turn: firstMove });

    navigation.navigate("GameScreen", {
      docRef: docRef,
      p1orp2: p1orp2,
    });
  }
};
