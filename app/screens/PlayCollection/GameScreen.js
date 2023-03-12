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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalText, setModalText] = useState();
  const [markedCards, setMarkedCards] = useState(
    new Array(cardSize).fill(false)
  );
  const [id, setId] = useState(100);
  const [urls, setUrls] = useState();

  const maxTurns = 10;

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
      setDocData(doc.data());

      setId(doc.data().id);

      // check for turn change
      if (prevTurnCountRef.current === -1 && doc.data().turn === p1orp2) {
        setTurnCount((prevTurnCount) => prevTurnCount + 2);
        setModalTitle(strings[language].youStart);
        setModalText(strings[language].youStartInfo);
        setModalVisible(true);
      } else if (
        prevTurnCountRef.current === -1 &&
        doc.data().turn !== p1orp2
      ) {
        setTurnCount((prevTurnCount) => prevTurnCount + 1);
        setModalTitle(strings[language].opponentStart);
        setModalText(strings[language].opponentStartInfo);
        setModalVisible(true);
      } else if (doc.data().turn === p1orp2) {
        setTurnCount((prevTurnCount) => prevTurnCount + 1);

        setModalTitle(strings[language].yourTurn);
        setModalText("");
        setModalVisible(true);
      }

      // assign turn
      if (doc.data().turn === "p1") {
        setTurn(doc.data().p1_name);
      } else {
        setTurn(doc.data().p2_name);
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
        navigation.navigate("Home");
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
        navigation.navigate("Home");
      } else if (doc.data().roomCode === -1 || doc.data().roomCode === -2) {
        unsubscribe();
        deleteDoc(docRef);
        navigation.navigate("Home");
      }
    });

    fetchImage();

    return () => {
      unsubscribe();
    };
  }, []);

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
            <Text style={styles.headerLabel}>{`${
              turnCount === 0 ? 1 : turnCount
            }/${maxTurns}`}</Text>
          </View>
        </SafeAreaView>
      ),
    });
  }, [turn, turnCount]);

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background1, colors.background2, colors.background3]}
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
                style={styles.buttonBox}
                onPress={async () => {}}
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
                style={styles.buttonBox}
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
        </View>
      ) : (
        <ActivityIndicator color={colors.white} size="large" />
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalFrame}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Ionicons name="close" size={30} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            {modalText !== "" && (
              <Text style={styles.modalText}>{modalText}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modal: {
    width: "70%",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.tint,
    backgroundColor: colors.third,
    paddingVertical: 50,
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
    paddingHorizontal: 10,
    paddingTop: 10,
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
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
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
