import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import backImage from "../../assets/backImage.png";
import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";
import { colors } from "../../assets/colors";
import { getCategoriesData } from "../../../firebase";

const CreateGameScreen = () => {
  const { categoryData, setCategoryData, customCardsArray, language } =
    useContext(DataContext);
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
    <ImageBackground
      style={styles.container}
      source={backImage}
      resizeMode={"stretch"}
    >
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
    </ImageBackground>
  );
};

export default CreateGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
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
    width: "70%",
    alignItems: "center",
    padding: 15,
    marginHorizontal: "15%",
    borderRadius: 10,
  },
  activeItemBox: {
    backgroundColor: colors.primary,
    borderWidth: 1,
  },
  itemBoxContent: {
    fontSize: 22,
    fontFamily: "CentraMedium",
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

const createRoom = (categoryIndex) => {
  console.log(categoryIndex);
};
