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
  const [username, setUsername] = useState();
  const [categoryData, setCategoryData] = useState();
  const [customCardsArray, setCustomCardsArray] = useState();

  const retriveUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retriveUsername();
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
            headerTintColor: colors.black,
            headerStyle: { backgroundColor: colors.primary },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="CardCategories"
            component={CardCategoriesScreen}
            options={({ navigation }) => ({
              title: "Categories",
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.push("CustomCard")}>
                  <Octicons name="plus" size={30} color={colors.black} />
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
