import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { db, getCategoriesData } from "../../../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const CreateGameScreen = () => {
  const {
    categoryData,
    setCategoryData,
    customCardsArray,
    language,
    username,
  } = useContext(DataContext);
  const [categoryIndex, setCategoryIndex] = useState(0);

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
        onPress={() =>
          createRoom({
            cards: categoryData[categoryIndex],
            username: username,
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.createButton}>
          <Text style={styles.createButtonText}>
            {strings[language].createRoom}
          </Text>
        </View>
      </TouchableOpacity>
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
});

const createRoom = async ({ cards, username }) => {
  const roomCode = await createRoomCode();

  try {
    await addDoc(collection(db, "Games"), {
      cards: cards.cards,
      p1_name: username,
      p1_pick: "notSet",
      p2_name: "notSet",
      p2_pick: "notSet",
      roomCode: roomCode,
      title: cards.title,
      turn: "notSet",
    });
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    deleteRoom(roomCode);
  }, 10000);
};

const createRoomCode = async () => {
  const gamesRef = collection(db, "Games");
  let code;

  do {
    code = Math.floor(Math.random() * (10000 - 1000) + 1000);

    const q = query(gamesRef, where("roomCode", "==", code));
    gamesSnapshot = await getDocs(q);
  } while (!gamesSnapshot.empty);

  return code;
};

const deleteRoom = async (code) => {
  const gamesRef = collection(db, "Games");

  const q = query(gamesRef, where("roomCode", "==", code));
  gamesSnapshot = await getDocs(q);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
};
