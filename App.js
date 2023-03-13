import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Localization from "expo-localization";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import logo from "./app/assets/logo.png";
import { colors } from "./app/assets/colors";
import { DataContext } from "./DataContext";
import CardCategoriesScreen from "./app/screens/CardCollection/CardCategoriesScreen";
import CardScreen from "./app/screens/CardCollection/CardScreen";
import CustomCardScreen from "./app/screens/CardCollection/CustomCardScreen";
import HomeScreen from "./app/screens/HomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import StartScreen from "./app/screens/StartCollection/StartScreen";
import { strings } from "./app/assets/languages";
import { fonts } from "./app/assets/fonts";
import PickScreen from "./app/screens/PlayCollection/PickScreen";
import GameScreen from "./app/screens/PlayCollection/GameScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState();
  const [username, setUsername] = useState();
  const [customCardsArray, setCustomCardsArray] = useState();
  const [categoryData, setCategoryData] = useState();

  const retriveUserRelatedData = async () => {
    try {
      const usernameValue = await AsyncStorage.getItem("username");
      const customCardsValue = await AsyncStorage.getItem("customCards");
      const languageValue = await AsyncStorage.getItem("language");

      // get user name data
      if (usernameValue !== null) {
        setUsername(usernameValue);
      } else {
        const newUserUsername = `afacan${Math.floor(
          Math.random() * (100 - 1) + 1
        )}`;
        setUsername(newUserUsername);

        try {
          await AsyncStorage.setItem("username", newUserUsername);
        } catch (e) {
          console.log(e);
        }
      }

      // get custom cards data
      if (customCardsValue !== null) {
        setCustomCardsArray(JSON.parse(customCardsValue));
      }

      // get language value
      if (languageValue !== null) {
        setLanguage(languageValue);
      } else {
        const systemLanguage = Localization.locale.split("-")[0];

        if (strings.hasOwnProperty(systemLanguage)) {
          setLanguage(systemLanguage);
          await AsyncStorage.setItem("language", systemLanguage);
        } else {
          setLanguage("en");
          await AsyncStorage.setItem("language", "en");
        }
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    retriveUserRelatedData();
  }, []);

  const [fontsLoaded] = useFonts(fonts);

  if (!loading && fontsLoaded) {
    return (
      <DataContext.Provider
        value={{
          categoryData,
          setCategoryData,
          username,
          setUsername,
          customCardsArray,
          setCustomCardsArray,
          language,
          setLanguage,
        }}
      >
        <StatusBar barStyle={"light-content"} />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerTitleStyle: { fontFamily: "CentraMedium", fontSize: 22 },
              headerTintColor: colors.white,
              headerStyle: { backgroundColor: colors.tint },
              headerBackTitle: ` `,
              orientation: "portrait",
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "",
                headerShown: true,
                headerTransparent: true,
                headerStyle: { backgroundColor: "transparent" },
                headerRight: () => <HeaderRightComponent language={language} />,
              }}
            />
            <Stack.Screen
              name="Play"
              component={StartScreen}
              options={{ title: strings[language].play, headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: strings[language].settings,
                animation: "fade_from_bottom",
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="CardCategories"
              component={CardCategoriesScreen}
              options={({ navigation }) => ({
                title: strings[language].categories,
                animation: "fade_from_bottom",
                gestureEnabled: false,
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.push("CustomCard")}
                  >
                    <Octicons name="plus" size={30} color={colors.white} />
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="Cards"
              component={CardScreen}
              options={({ route }) => ({ title: route.params.title })}
            />
            <Stack.Screen
              name="CustomCard"
              component={CustomCardScreen}
              options={{
                title: strings[language].customCardSet,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="PickCard"
              component={PickScreen}
              options={{
                title: strings[language].pickCard,
                headerBackVisible: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="GameScreen"
              component={GameScreen}
              options={{
                gestureEnabled: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DataContext.Provider>
    );
  }
}

const HeaderRightComponent = ({ language }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <AntDesign name="questioncircle" size={30} color={colors.black} />
      </TouchableOpacity>
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
            <Text style={styles.modalTitle}>{strings[language].howToPlay}</Text>
            <Text style={styles.modalText}>
              {strings[language].howToPlayInfo}
            </Text>
            <View style={styles.logo}>
              <Image style={{ width: 80, height: 45 }} source={logo} />
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    right: -10,
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
    paddingTop: 40,
    paddingBottom: 20,
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
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
  },
  logo: {
    marginTop: 20,
    width: 80,
    height: 45,
    backgroundColor: colors.black,
  },
});
