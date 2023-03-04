import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import * as Localization from "expo-localization";

import Octicons from "react-native-vector-icons/Octicons";

import { colors } from "./app/assets/colors";
import { DataContext } from "./DataContext";
import CardCategoriesScreen from "./app/screens/CardCollection/CardCategoriesScreen";
import CardScreen from "./app/screens/CardCollection/CardScreen";
import CustomCardScreen from "./app/screens/CardCollection/CustomCardScreen";
import HomeScreen from "./app/screens/HomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import StartScreen from "./app/screens/StartScreen";
import { strings } from "./app/assets/languages";

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

  if (!loading) {
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
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName={"Home"}
            screenOptions={{
              headerTintColor: colors.white,
              headerStyle: { backgroundColor: colors.tint },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Play"
              component={StartScreen}
              options={{ title: strings[language].play }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: strings[language].settings }}
            />
            <Stack.Screen
              name="CardCategories"
              component={CardCategoriesScreen}
              options={({ navigation }) => ({
                title: strings[language].categories,
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
          </Stack.Navigator>
        </NavigationContainer>
      </DataContext.Provider>
    );
  }
}
