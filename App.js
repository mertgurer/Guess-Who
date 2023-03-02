import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native-web";

import { CardCategoriesScreen } from "./app/screens/CardCategoriesScreen";
import { HomeScreen } from "./app/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CardCategories"
          component={CardCategoriesScreen}
          options={{
            title: "Cards",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#121212" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function NavHeader() {
  return <View></View>;
}
