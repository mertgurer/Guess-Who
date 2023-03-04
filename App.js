import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

import Octicons from "react-native-vector-icons/Octicons";

import { colors } from "./app/assets/colors";
import { DataContext } from "./DataContext";
import CardCategoriesScreen from "./app/screens/CardCollection/CardCategoriesScreen";
import CardScreen from "./app/screens/CardCollection/CardScreen";
import CustomCardScreen from "./app/screens/CardCollection/CustomCardScreen";
import HomeScreen from "./app/screens/HomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import StartScreen from "./app/screens/StartScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef(null);
  const [language, setLanguage] = useState("en");
  const [username, setUsername] = useState();
  const [customCardsArray, setCustomCardsArray] = useState();
  const [categoryData, setCategoryData] = useState();

  const retriveUserRelatedData = async () => {
    try {
      const usernameValue = await AsyncStorage.getItem("username");
      const customCardsValue = await AsyncStorage.getItem("customCards");

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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retriveUserRelatedData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        categoryData,
        setCategoryData,
        username,
        setUsername,
        customCardsArray,
        setCustomCardsArray,
      }}
    >
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Home"
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

          <Stack.Screen name="Play" component={StartScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="CardCategories"
            component={CardCategoriesScreen}
            options={({ navigation }) => ({
              title: "Categories",
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.push("CustomCard")}>
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
            options={{ title: "Custom Card Set", presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContext.Provider>
  );
}
