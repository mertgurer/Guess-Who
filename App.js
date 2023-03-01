import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
        <Stack.Screen name="CardCategories" component={CardCategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
