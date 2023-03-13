import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import Ionicons from "react-native-vector-icons/Ionicons";

import { colors } from "../../assets/colors";
import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";
import { storage } from "../../../firebase";

const GameScreen = ({ route, navigation }) => {
  const { language, username } = useContext(DataContext);
  const { title, docRef, p1orp2, pick, cardSize } = route.params;
  const [docData, setDocData] = useState();
  const [turn, setTurn] = useState();
  const [turnCount, setTurnCount] = useState(-1);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalText, setModalText] = useState();
  const [markedCards, setMarkedCards] = useState(
    new Array(cardSize).fill(false)
  );
  const [id, setId] = useState(100);
  const [urls, setUrls] = useState();
  const [modalGuessVisible, setModalGuessVisible] = useState(false);
  const [guessIndex, setGuessIndex] = useState(-1);
  const [gameOver, setGameOver] = useState(false);

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
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (gameOver) return;

      setDocData(doc.data());

      setId(doc.data().id);

      // check for turn change
      if (prevTurnCountRef.current === -1 && doc.data().turn === p1orp2) {
        setTurnCount((prevTurnCount) => prevTurnCount + 2);
        setModalTitle(strings[language].youStart);
        setModalText(strings[language].youStartInfo);
        setModalInfoVisible(true);
      } else if (
        prevTurnCountRef.current === -1 &&
        doc.data().turn !== p1orp2
      ) {
        setTurnCount((prevTurnCount) => prevTurnCount + 1);
        setModalTitle(strings[language].opponentStart);
        setModalText(strings[language].opponentStartInfo);
        setModalInfoVisible(true);
      } else if (doc.data().turn === p1orp2 && !gameOver) {
        setTurnCount((prevTurnCount) => prevTurnCount + 1);

        setModalTitle(strings[language].yourTurn);
        setModalText("");
        setModalInfoVisible(true);
      }

      // assign turn
      if (doc.data().turn === "p1") {
        setTurn(doc.data().p1_name);
      } else {
        setTurn(doc.data().p2_name);
      }

      // check for room code change
      if (
        (doc.data().roomCode === -1 && doc.data().p2_name === username) ||
        (doc.data().roomCode === -2 && doc.data().p1_name === username)
      ) {
        Alert.alert(
          strings[language].gameAborted,
          strings[language].opponentLeft,
          [{ text: strings[language].ok }]
        );
        unsubscribe();
        deleteDoc(docRef);
        navigation.navigate("Home");
      } else if (doc.data().roomCode === -1 || doc.data().roomCode === -2) {
        unsubscribe();
        deleteDoc(docRef);
        navigation.navigate("Home");
      } else if (
        (doc.data().roomCode === 1 && p1orp2 === "p2") ||
        (doc.data().roomCode === 2 && p1orp2 === "p1")
      ) {
        setGameOver(true);
        setModalTitle(strings[language].lost);
        setModalText(strings[language].lostInfo);
        setModalInfoVisible(true);
      }
    });

    fetchImage();

    return () => {
      unsubscribe();
    };
  }, [gameOver]);

  const prevTurnCountRef = useRef(0);
  useEffect(() => {
    prevTurnCountRef.current = turnCount;
  }, [turnCount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView style={styles.headerContainer}>
          <View style={styles.headerZone}>
            <Text style={styles.headerTitle}>{strings[language].turn}</Text>
            <Text style={styles.headerLabel}>{turn}</Text>
          </View>
          <View style={styles.headerZone}>
            <Text style={styles.headerTitle}>{strings[language].yourCard}</Text>
            <Text style={styles.headerLabel}>{pick}</Text>
          </View>
          <View style={styles.headerZone}>
            <Text style={styles.headerTitle}>
              {strings[language].turnCount}
            </Text>
            <Text style={styles.headerLabel}>
              {turnCount === 0 ? 1 : turnCount}
            </Text>
          </View>
        </SafeAreaView>
      ),
    });
  }, [turn, turnCount]);

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
        <View style={styles.container}>
          <FlatList
            style={styles.cards}
            data={docData.cards}
            renderItem={({ item, index }) => (
              <Item
                card={item}
                index={index}
                markedCards={markedCards}
                setMarkedCards={setMarkedCards}
                url={urls[item]}
                originals={id > 99 ? false : true}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 10 }}
            keyExtractor={(index) => index.toString()}
          />
          <View style={styles.buttonArea}>
            <View
              style={{
                width: 170,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.buttonBox,
                  username !== turn && {
                    backgroundColor: "grey",
                    opacity: 0.9,
                  },
                ]}
                onPress={() => {
                  setModalGuessVisible(!modalGuessVisible);
                  setGuessIndex(-1);
                }}
                disabled={username !== turn}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonContent}>
                  {strings[language].guess}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: 170,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.buttonBox,
                  username !== turn && {
                    backgroundColor: "grey",
                    opacity: 0.9,
                  },
                ]}
                onPress={async () => {
                  if (docData.turn === p1orp2) {
                    if (p1orp2 === "p1") {
                      await updateDoc(docRef, { turn: "p2" });
                    } else {
                      await updateDoc(docRef, { turn: "p1" });
                    }
                  }
                }}
                disabled={username !== turn}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonContent}>
                  {strings[language].endTurn}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              Alert.alert(strings[language].exit, "", [
                {
                  text: strings[language].no,
                  style: "cancel",
                },
                {
                  text: strings[language].yes,
                  style: "destructive",
                  onPress: async () => {
                    if (docData.p1_name === username) {
                      await updateDoc(docRef, { roomCode: -1 });
                    } else {
                      await updateDoc(docRef, { roomCode: -2 });
                    }
                    navigation.navigate("Home");
                  },
                },
              ]);
            }}
          >
            <Ionicons name="close" size={32} color={colors.black} />
          </TouchableOpacity>
          <Modal
            visible={modalGuessVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              setModalInfoVisible(!modalGuessVisible);
            }}
          >
            <View style={styles.modalFrame}>
              <View style={styles.modalGuess}>
                <Text style={styles.guessInfo}>
                  {strings[language].guessInfo}
                </Text>
                <ScrollView>
                  {(() => {
                    const elements = [];
                    for (let index = 0; index < docData.cards.length; index++) {
                      if (!markedCards[index]) {
                        if (index !== 0)
                          elements.push(
                            <View key={index - 100} style={styles.seperator} />
                          );
                        elements.push(
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setGuessIndex(index);
                            }}
                            activeOpacity={0.5}
                          >
                            <View
                              style={[
                                styles.guessBox,
                                guessIndex === index && styles.activeGuessBox,
                              ]}
                            >
                              <Text style={styles.guessBoxContent}>
                                {docData.cards[index]}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    }
                    return elements;
                  })()}
                </ScrollView>
                <TouchableOpacity
                  style={styles.guessButton}
                  disabled={guessIndex === -1}
                  onPress={() => {
                    makeGuess({
                      docRef: docRef,
                      language: language,
                      cards: docData.cards,
                      pick: guessIndex,
                      oponentPick:
                        p1orp2 === "p1" ? docData.p2_pick : docData.p1_pick,
                      p1orp2: p1orp2,
                      setModalGuessVisible: setModalGuessVisible,
                      setModalTitle: setModalTitle,
                      setModalText: setModalText,
                      setModalInfoVisible: setModalInfoVisible,
                      setGameOver: setGameOver,
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guessButtonContent}>
                    {strings[language].guess}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setModalGuessVisible(!modalGuessVisible);
                  }}
                >
                  <Ionicons name="close" size={30} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <ActivityIndicator color={colors.white} size="large" />
      )}
      <Modal
        visible={modalInfoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalInfoVisible(!modalInfoVisible);
        }}
      >
        <View style={styles.modalFrame}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                if (gameOver) {
                  navigation.navigate("Home");
                  deleteDoc(docRef);
                } else {
                  setModalInfoVisible(!modalInfoVisible);
                }
              }}
            >
              <Ionicons name="close" size={30} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            {modalText !== "" && (
              <Text style={styles.modalText}>
                {modalText}
                {gameOver && docData.turn !== p1orp2 && (
                  <Text style={{ fontFamily: "CentraBold" }}>
                    {p1orp2 === "p1" ? docData.p2_pick : docData.p1_pick}
                  </Text>
                )}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.tint,
    flexDirection: "row",
    paddingVertical: 10,
  },
  headerZone: {
    flex: 1,
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
  },
  headerTitle: {
    color: colors.white,
    fontFamily: "CentraBold",
  },
  headerLabel: {
    color: colors.white,
    fontFamily: "CentraBook",
  },
  modalFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "70%",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.tint,
    backgroundColor: colors.third,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  modalTitle: {
    fontFamily: "CentraBold",
    fontSize: 30,
    textAlign: "center",
  },
  modalText: {
    fontFamily: "CentraBook",
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  cardBoxContent: {
    color: colors.black,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
    position: "absolute",
  },
  marked: {
    opacity: 0.3,
    transform: [{ scale: 0.95 }],
  },
  buttonArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 30,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: colors.halfBlack,
    borderColor: colors.black,
    borderTopWidth: 2,
  },
  buttonBox: {
    width: 150,
    height: 60,
    backgroundColor: colors.third,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.black,
  },
  buttonContent: {
    fontSize: 20,
    fontFamily: "CentraMedium",
  },
  exitButton: {
    backgroundColor: colors.third,
    width: 36,
    aspectRatio: 1,
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
  },
  modalGuess: {
    maxHeight: "70%",
    width: "80%",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.tint,
    backgroundColor: colors.third,
    paddingVertical: 20,
  },
  guessInfo: {
    textAlign: "center",
    paddingHorizontal: 50,
    marginBottom: 10,
    fontFamily: "CentraBook",
  },
  guessBox: {
    alignItems: "center",
    padding: 15,
    marginHorizontal: "10%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeGuessBox: {
    backgroundColor: colors.secondary,
    borderColor: colors.tint,
  },
  guessBoxContent: {
    fontSize: 22,
    fontFamily: "CentraBook",
    textAlign: "center",
  },
  seperator: {
    height: 1,
    backgroundColor: colors.black,
    marginHorizontal: "15%",
    marginVertical: 7,
  },
  guessButton: {
    borderWidth: 2,
    borderColor: colors.tint,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: "20%",
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  guessButtonContent: {
    fontSize: 20,
    fontFamily: "CentraMedium",
    textAlign: "center",
  },
});

const Item = ({ card, index, markedCards, setMarkedCards, url, originals }) => (
  <TouchableOpacity
    onPress={() => {
      const temp = [...markedCards];
      temp[index] = !markedCards[index];
      setMarkedCards(temp);
    }}
    activeOpacity={0.8}
  >
    <View style={[styles.cardBox, markedCards[index] && styles.marked]}>
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

const makeGuess = async ({
  docRef,
  language,
  cards,
  pick,
  oponentPick,
  p1orp2,
  setModalGuessVisible,
  setModalTitle,
  setModalText,
  setModalInfoVisible,
  setGameOver,
}) => {
  if (cards[pick] === oponentPick) {
    setGameOver(true);

    setModalGuessVisible(false);
    if (p1orp2 === "p1") {
      await updateDoc(docRef, { roomCode: 1 });
    } else {
      await updateDoc(docRef, { roomCode: 2 });
    }

    setModalTitle(strings[language].correctGuess);
    setModalText(strings[language].correctGuessInfo);
    setModalInfoVisible(true);
  } else {
    setModalGuessVisible(false);
    if (p1orp2 === "p1") {
      await updateDoc(docRef, { turn: "p2" });
    } else {
      await updateDoc(docRef, { turn: "p1" });
    }

    setModalTitle(strings[language].wrongGuess);
    setModalText("");
    setModalInfoVisible(true);
  }
};
