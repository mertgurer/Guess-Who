import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import DataContext from "../../DataContext";
import { colors } from "../assets/colors";
import backImage from "../assets/backImage.png";
import { getCategoriesData } from "../../firebase";

import Ionicons from "react-native-vector-icons/Ionicons";
import { strings } from "../assets/languages";

const StartScreen = () => {
  const { categoryData, setCategoryData, customCardsArray, language } =
    useContext(DataContext);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [roomCode, setRoomCode] = useState();

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
    <ImageBackground
      style={styles.container}
      source={backImage}
      resizeMode={"stretch"}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={130}
      >
        <View style={styles.createArea}>
          <View style={styles.headerText}>
            <Text style={{ fontSize: 30 }}>{strings[language].create}</Text>
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
                                index === categoryIndex
                                  ? colors.white
                                  : colors.black,
                            },
                          ]}
                        >
                          {categoryData[index].title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
                return elements;
              })()}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={() => createRoom({ categoryIndex: categoryIndex })}
            activeOpacity={0.8}
          >
            <View style={styles.createButton}>
              <Text style={styles.createButtonText}>
                {strings[language].createRoom}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.joinArea}>
          <View style={styles.headerText}>
            <Text style={{ fontSize: 30 }}>{strings[language].join}</Text>
          </View>
          <View style={styles.joinZone}>
            <TextInput
              style={styles.roomCodeInput}
              onChangeText={setRoomCode}
              value={roomCode}
              placeholder={strings[language].codeInfo}
              placeholderTextColor={colors.tint}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              onPress={() => joinRoom({ roomCode: roomCode })}
              activeOpacity={0.8}
            >
              <View style={styles.joinButton}>
                <Ionicons name="arrow-forward" size={50} color={colors.black} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingBox: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    width: "60%",
    margin: "20%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 30,
    color: colors.white,
  },
  headerText: {
    backgroundColor: colors.third,
    alignItems: "center",
    width: 200,
    marginTop: 15,
    marginBottom: 20,
    paddingVertical: 3,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 5,
  },
  createArea: {
    flex: 5,
    alignItems: "center",
    borderBottomWidth: 10,
    borderRadius: 60,
  },
  categoryList: {
    flex: 1,
    backgroundColor: colors.secondary,
    width: "80%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.black,
  },
  itemBox: {
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: colors.halfBlack,
    borderRadius: 50,
    alignItems: "center",
    padding: 15,
    marginHorizontal: "5%",
  },
  activeItemBox: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
  },
  itemBoxContent: {
    fontSize: 22,
    fontWeight: "500",
  },
  createButton: {
    width: 90,
    aspectRatio: 1,
    backgroundColor: colors.third,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 30,
    borderWidth: 3,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
  },
  createButtonText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  joinArea: {
    flex: 2,
    alignItems: "center",
    borderTopColor: colors.black,
    borderTopWidth: 10,
    borderRadius: 60,
  },
  joinZone: {
    flexDirection: "row",
  },
  roomCodeInput: {
    backgroundColor: colors.secondary,
    width: 220,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 20,
    textAlign: "center",
  },
  joinButton: {
    width: 70,
    height: 60,
    backgroundColor: colors.third,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default StartScreen;

const createRoom = (categoryIndex) => {
  console.log(categoryIndex);
};

const joinRoom = (roomCode) => {
  console.log(roomCode);
};
