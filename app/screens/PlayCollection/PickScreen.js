import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { storage } from "../../../firebase";

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
  const [id, setId] = useState(100);
  const [urls, setUrls] = useState();
  const [random, setRandom] = useState(false);

  const p1orp2 = route.params.p1orp2;
  const title = route.params.title;

  const fetchImage = async () => {
    const storageRef = ref(storage, title);
    const allImages = await listAll(storageRef);

    const imageObjects = await Promise.all(
      allImages.items.map(async (imageRef) => {
        const object = await getDownloadURL(imageRef);
        return { [imageRef.name.split(".")[0]]: object };
      })
    );

    setUrls(Object.assign({}, ...imageObjects));
  };

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

      setId(doc.data().id);

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
        unsubscribe();

        navigation.navigate("GameScreen", {
          docRef: docRef,
          p1orp2: p1orp2,
          pick: doc.data().cards[playerPick],
          cardSize: doc.data().cards.length,
          title: title,
        });
      }
    });

    fetchImage();

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
      unsubscribe();
    };
  }, [playerPick]);

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
  }, [navigation, docData, opponentName, opponentPicked]);

  return (
    <LinearGradient
      style={styles.container}
      colors={[
        colors.background1,
        colors.background2,
        colors.background2,
        colors.background1,
      ]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {docData && urls ? (
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
                url={urls[item]}
                originals={id > 99 ? false : true}
                random={random}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
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
                    color={colors.black}
                    style={{ marginTop: 3, marginLeft: 1 }}
                  />
                ) : turn === 1 ? (
                  <Text style={styles.turnText}>P1</Text>
                ) : (
                  <Text style={styles.turnText}>P2</Text>
                )}
              </TouchableOpacity>
            )}
            <View>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  const randomPick = Math.floor(
                    Math.random() * docData.cards.length
                  );
                  handleLockIn({
                    docRef: docRef,
                    docData: docData,
                    pick: randomPick,
                    p1orp2: p1orp2,
                    playerPick: playerPick,
                    setPlayerPick: setPlayerPick,
                    language: language,
                    random: true,
                    setRandom: setRandom,
                  });
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 25,
                    fontFamily: "CentraBook",
                  }}
                >
                  {strings[language].random}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() =>
                  handleLockIn({
                    docRef: docRef,
                    docData: docData,
                    pick: pick,
                    p1orp2: p1orp2,
                    playerPick: playerPick,
                    setPlayerPick: setPlayerPick,
                    language: language,
                    random: false,
                    setRandom: setRandom,
                  })
                }
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 25,
                    fontFamily: "CentraBook",
                  }}
                >
                  {strings[language].lockIn}
                </Text>
              </TouchableOpacity>
            </View>
            {p1orp2 === "p1" && (
              <TouchableOpacity
                style={styles.button}
                disabled={disbaleStart}
                onPress={() =>
                  handleStartGame({
                    docRef: docRef,
                    docData: docData,
                    turn: turn,
                    playerPick: playerPick,
                    opponentPicked: opponentPicked,
                    p1orp2: p1orp2,
                    setDisableStart: setDisableStart,
                    title: title,
                    language: language,
                    navigation: navigation,
                  })
                }
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="arrow-right"
                  size={30}
                  color={colors.black}
                  style={{ marginLeft: 4, marginBottom: 2 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <ActivityIndicator color={colors.white} size="large" />
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
    position: "absolute",
  },
  buttonArea: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
    alignItems: "flex-end",
  },
  confirmButton: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.third,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.black,
    marginHorizontal: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: colors.third,
    width: 60,
    height: 85,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.black,
  },
  turnText: {
    color: colors.black,
    fontSize: 30,
    fontFamily: "CentraBold",
    textAlign: "center",
  },
  startButton: {},
});

const Item = ({
  card,
  index,
  pick,
  setPick,
  playerPick,
  url,
  originals,
  random,
}) => (
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
        playerPick === index && !random && styles.pickedCard,
      ]}
    >
      <Image
        source={{ uri: url }}
        style={{ width: 165, height: 165, borderRadius: 13 }}
      />
      <Text
        style={[
          styles.cardBoxContent,
          originals && {
            bottom: 10,
            color: colors.white,
            backgroundColor: "#000000b0",
            width: 170,
          },
        ]}
      >
        {card}
      </Text>
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
  random,
  setRandom,
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

  let header, body;

  if (random) {
    header = strings[language].lockInRandom;
    body = strings[language].lockInRandomInfo;
  } else {
    header = `${strings[language].lockIn} "${docData.cards[pick]}"`;
    body = strings[language].lockInInfo;
  }

  Alert.alert(header, body, [
    {
      text: strings[language].no,
      style: "cancel",
    },
    {
      text: strings[language].yes,
      style: "ok",
      onPress: async () => {
        setPlayerPick(pick);

        setRandom(random);

        if (p1orp2 === "p1") {
          await updateDoc(docRef, { p1_pick: docData.cards[pick] });
        } else {
          await updateDoc(docRef, { p2_pick: docData.cards[pick] });
        }
      },
    },
  ]);
};

const handleStartGame = async ({
  docRef,
  docData,
  turn,
  playerPick,
  opponentPicked,
  p1orp2,
  setDisableStart,
  title,
  language,
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
      firstMove = temp === 1 ? "p1" : "p2";
    } else if (turn === 1) {
      firstMove = "p1";
    } else {
      firstMove = "p2";
    }
    await updateDoc(docRef, { turn: firstMove });

    navigation.navigate("GameScreen", {
      docRef: docRef,
      p1orp2: p1orp2,
      pick: docData.cards[playerPick],
      cardSize: docData.cards.length,
      title: title,
    });
  }
};
