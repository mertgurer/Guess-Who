import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
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
import { db, getCategoriesData, storage } from "../../../firebase";
import { getDownloadURL, ref } from "firebase/storage";

const Item = ({
  item,
  index,
  language,
  setRoomCode,
  categoryData,
  username,
  setModalVisible,
  navigation,
  setCategoryIndex,
  url,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  return (
    <View style={styles.categoryBox}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%", borderRadius: 13 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.categoryBoxContent}>{item.title}</Text>
      )}

      <View style={styles.createRoomField}>
        <TouchableOpacity
          disabled={buttonDisabled}
          onPress={async () => {
            setButtonDisabled(true);
            setCategoryIndex(index);

            uniqueRoomCode = await generateRoomCode();
            setRoomCode(uniqueRoomCode);

            createRoom({
              cards: categoryData[index],
              username: username,
              roomCode: uniqueRoomCode,
              setModalVisible: setModalVisible,
              setButtonDisabled: setButtonDisabled,
              id: categoryData[index].id,
              navigation: navigation,
            });
          }}
          activeOpacity={0.5}
        >
          <Text style={styles.createRoomText}>
            {strings[language].createRoom}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  const [urls, setUrls] = useState();

  const fetchCategoriesData = async () => {
    const temp = await getCategoriesData();
    fetchImage({ data: temp });

    if (customCardsArray) {
      setCategoryData([...temp, ...customCardsArray]);
    } else {
      setCategoryData(temp);
    }
  };

  const fetchImage = async ({ data }) => {
    const imageUrls = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].id < 100) {
        const storageRef = ref(
          storage,
          `${data[i].title}/${data[i].title}_cover.jpg`
        );

        const url = await getDownloadURL(storageRef);
        imageUrls[data[i].title] = url;
      }
    }
    setUrls(imageUrls);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <View style={styles.container}>
      {categoryData && urls ? (
        <FlatList
          style={styles.cardCategories}
          data={categoryData}
          renderItem={({ item, index }) => (
            <Item
              item={item}
              index={index}
              language={language}
              setRoomCode={setRoomCode}
              categoryData={categoryData}
              username={username}
              setModalVisible={setModalVisible}
              navigation={navigation}
              setCategoryIndex={setCategoryIndex}
              url={urls[item.title]}
            />
          )}
          ListHeaderComponent={() => (
            <View style={styles.categoryBox}>
              <Text
                style={{
                  fontFamily: "CentraBook",
                  fontSize: 30,
                  color: colors.white,
                }}
              >
                {strings[language].categories}
              </Text>
            </View>
          )}
          contentContainerStyle={{
            paddingBottom: 15,
            paddingTop: 10,
            paddingHorizontal: 10,
            gap: 10,
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator
            style={styles.categoryList}
            color={colors.black}
            size="small"
          />
        </View>
      )}

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
                  color: colors.primary,
                }}
              >
                {strings[language].createStatus}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CreateGameScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.third,
    flex: 1,
  },
  categoryBox: {
    backgroundColor: colors.fourth,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginHorizontal: 5,

    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  categoryBoxContent: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "CentraBook",
  },
  createRoomField: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    borderTopWidth: 1,
    alignItems: "flex-end",
    paddingRight: 10,
    borderColor: colors.halfWhite,
  },
  createRoomText: {
    padding: 5,
    fontFamily: "CentraBook",
    color: colors.white,
  },
  modalFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "75%",
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
    color: colors.primary,
    fontSize: 20,
  },
  modalText: {
    fontSize: 35,
    textAlign: "center",
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
  id,
  navigation,
}) => {
  try {
    const docRef = await addDoc(collection(db, "Games"), {
      cards: cards.cards,
      id: id,
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
        navigation.push("PickCard", {
          docRef: docRef,
          p1orp2: "p1",
          title: cards.title,
        });
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
