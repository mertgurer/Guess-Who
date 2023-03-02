import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "./app/assets/colors";
import { DataContext } from "./DataContext";
import CardCategoriesScreen from "./app/screens/CardCategoriesScreen";
import CardScreen from "./app/screens/CardScreen";
import HomeScreen from "./app/screens/HomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import StartScreen from "./app/screens/StartScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [username, setUsername] = useState();
  const [categoryData, setCategoryData] = useState();

  const retriveUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
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
      value={{ categoryData, setCategoryData, username, setUsername }}
    >
      <NavigationContainer>
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

          <Stack.Screen
            name="CardCategories"
            component={CardCategoriesScreen}
            options={{ title: "Categories" }}
          />

          <Stack.Screen
            name="Cards"
            component={CardScreen}
            options={({ route }) => ({ title: route.params.title })}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContext.Provider>
  );
}
