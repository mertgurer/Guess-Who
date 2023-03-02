import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "./app/assets/colors";
import { DataContext } from "./DataContext";
import { CardCategoriesScreen } from "./app/screens/CardCategoriesScreen";
import { CardScreen } from "./app/screens/CardScreen";
import { HomeScreen } from "./app/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [categoryData, setCategoryData] = useState();

  return (
    <DataContext.Provider value={{ categoryData, setCategoryData }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            title: "Card Categories",
            headerTintColor: colors.black,
            headerStyle: { backgroundColor: colors.primary },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          {
            <Stack.Screen
              name="CardCategories"
              component={CardCategoriesScreen}
              options={{ title: "Categories" }}
            />
          }
          <Stack.Screen
            name="Cards"
            component={CardScreen}
            options={({ route }) => ({ title: route.params.title })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContext.Provider>
  );
}
