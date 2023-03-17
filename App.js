import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, TouchableOpacity } from "react-native";
import * as Localization from "expo-localization";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

import Feather from "react-native-vector-icons/Feather";

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
        <StatusBar barStyle={"dark-content"} />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerTitleStyle: { fontFamily: "CentraMedium", fontSize: 22 },
              headerTintColor: colors.white,
              headerStyle: { backgroundColor: colors.primary },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
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
              options={({ navigation }) => ({
                title: strings[language].settings,
                headerStyle: { backgroundColor: colors.third },
                headerTintColor: colors.black,
                headerLeft: () =>
                  BackButton({
                    navigation: navigation,
                    front: colors.black,
                  }),
              })}
            />
            <Stack.Screen
              name="CardCategories"
              component={CardCategoriesScreen}
              options={({ navigation }) => ({
                title: strings[language].categories,
                headerLeft: () =>
                  BackButton({
                    navigation: navigation,
                    front: colors.primary,
                  }),
                headerRight: () => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.white,
                      width: 32,
                      aspectRatio: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 16,
                    }}
                    onPress={() =>
                      navigation.push("CustomCard", { title: "", cards: [] })
                    }
                  >
                    <Feather
                      name="plus"
                      size={24}
                      color={colors.primary}
                      style={{ left: 1 }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="Cards"
              component={CardScreen}
              options={({ route, navigation }) => ({
                title: route.params.title,
                headerLeft: () =>
                  BackButton({
                    navigation: navigation,
                    front: colors.primary,
                  }),
              })}
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

const BackButton = ({ navigation, front }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
        width: 32,
        aspectRatio: 1,
        borderRadius: 16,
      }}
      onPress={() => navigation.goBack()}
    >
      <Feather
        name={"chevron-left"}
        size={33}
        color={front}
        style={{ right: 1 }}
      />
    </TouchableOpacity>
  );
};
