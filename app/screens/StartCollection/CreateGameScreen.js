import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import Ionicons from "react-native-vector-icons/Ionicons";

import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { db, getCategoriesData } from "../../../firebase";

const CreateGameScreen = ({ navigation }) => {
  const {
    categoryData,
    setCategoryData,
    customCardsArray,
    language,
    username,
  } = useContext(DataContext);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const fetchCategoriesData = async () => {
    if (customCardsArray) {
      setCategoryData([...(await getCategoriesData()), ...customCardsArray]);
    } else {
      setCategoryData(await getCategoriesData());
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.background1, colors.background2, colors.background3]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{strings[language].categories}</Text>
      </View>

      {categoryData === undefined ? (
        <ActivityIndicator
          style={styles.categoryList}
          color={colors.black}
          size="large"
        />
      ) : (
        <ScrollView
          style={styles.categoryList}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {(() => {
            const elements = [];
            for (let index = 0; index < categoryData.length; index++) {
              elements.push(
                <TouchableOpacity
                  key={index}
                  onPress={() => setCategoryIndex(index)}
                  activeOpacity={0.5}
                >
                  <View
                    style={[
                      styles.itemBox,
                      index === categoryIndex && styles.activeItemBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemBoxContent,
                        {
                          color:
                            index !== categoryIndex
                              ? colors.white
                              : colors.black,
                          fontFamily:
                            index !== categoryIndex
                              ? "CentraBook"
                              : "CentraBold",
                        },
                      ]}
                    >
                      {categoryData[index].title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
              if (index + 1 !== categoryData.length)
                elements.push(
                  <View key={index - 100} style={styles.seperator} />
                );
            }
            return elements;
          })()}
        </ScrollView>
      )}

      <TouchableOpacity
        disabled={buttonDisabled}
        onPress={async () => {
          setButtonDisabled(true);

          uniqueRoomCode = await generateRoomCode();
          setRoomCode(uniqueRoomCode);

          createRoom({
            cards: categoryData[categoryIndex],
            username: username,
            roomCode: uniqueRoomCode,
            setModalVisible: setModalVisible,
            setButtonDisabled: setButtonDisabled,
            navigation: navigation,
          });
        }}
        activeOpacity={0.8}
      >
        <View style={styles.createButton}>
          <Text style={styles.createButtonText}>
            {strings[language].createRoom}
          </Text>
        </View>
      </TouchableOpacity>
      {roomCode !== undefined && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            deleteRoom(roomCode);
          }}
        >
          <View style={styles.modalFrame}>
            <View style={styles.modal}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setModalVisible(false);
                  deleteRoom(roomCode);
                }}
              >
                <Ionicons name="close" size={30} />
              </TouchableOpacity>
              <Text style={styles.modalHeader}>
                {strings[language].category}
              </Text>
              <Text style={[styles.modalText, { marginBottom: 15 }]}>
                {categoryData[categoryIndex].title}
              </Text>
              <Text style={styles.modalHeader}>
                {strings[language].codeInfo}
              </Text>
              <Text style={styles.modalText}>{roomCode}</Text>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontFamily: "CentraBook",
                  marginVertical: 30,
                }}
              >
                {strings[language].createInfo}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  textAlign: "center",
                  fontFamily: "CentraBook",
                }}
              >
                {strings[language].createStatus}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
};

export default CreateGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  header: {
    width: 200,
    height: 60,
    backgroundColor: colors.third,
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "CentraBook",
  },
  categoryList: {
    flex: 1,
    backgroundColor: colors.primary,
    width: "80%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.black,
  },
  itemBox: {
    width: "80%",
    alignItems: "center",
    padding: 15,
    marginHorizontal: "10%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeItemBox: {
    backgroundColor: colors.secondary,
    borderColor: colors.tint,
  },
  itemBoxContent: {
    fontSize: 22,
    fontFamily: "CentraMedium",
  },
  seperator: {
    width: "70%",
    height: 1,
    backgroundColor: colors.black,
    marginHorizontal: "15%",
    marginVertical: 7,
  },
  createButton: {
    width: 150,
    height: 50,
    backgroundColor: colors.third,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 20,
    fontFamily: "CentraBook",
    textAlign: "center",
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
  modalHeader: {
    fontFamily: "CentraMedium",
  },
  modalText: {
    fontSize: 35,
  },
});

const generateRoomCode = async () => {
  const gamesRef = collection(db, "Games");
  let code;

  do {
    code = Math.floor(Math.random() * (10000 - 1000) + 1000);

    const q = query(gamesRef, where("roomCode", "==", code));
    gamesSnapshot = await getDocs(q);
  } while (!gamesSnapshot.empty);

  return code;
};

let unsubscribe = null;

const createRoom = async ({
  cards,
  username,
  roomCode,
  setModalVisible,
  setButtonDisabled,
  navigation,
}) => {
  try {
    const docRef = await addDoc(collection(db, "Games"), {
      cards: cards.cards,
      p1_name: username,
      p1_pick: "notSet",
      p2_name: "notSet",
      p2_pick: "notSet",
      roomCode: roomCode,
      title: cards.title,
      turn: "notSet",
    });

    setModalVisible(true);
    setButtonDisabled(false);

    unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data();
      const p2_name = data.p2_name;

      if (p2_name !== "notSet") {
        setModalVisible(false);
        setButtonDisabled(false);
        unsubscribe();
        navigation.push("PickCard", { docRef: docRef });
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const deleteRoom = async (code) => {
  const gamesRef = collection(db, "Games");

  unsubscribe();

  const q = query(gamesRef, where("roomCode", "==", code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
};
