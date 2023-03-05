import React, { useContext } from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { colors } from "../../assets/colors";
import JoinGameScreen from "./JoinGameScreen";
import CreateGameScreen from "./CreateGameScreen";
import { strings } from "../../assets/languages";
import DataContext from "../../../DataContext";

const Tab = createBottomTabNavigator();

const StartScreen = ({ navigation }) => {
  const { language } = useContext(DataContext);

  return (
    <Tab.Navigator
      initialRouteName="CreateGame"
      screenOptions={({ route }) => ({
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: "CentraMedium", fontSize: 22 },
        headerStyle: { backgroundColor: colors.tint },
        tabBarStyle: { backgroundColor: colors.tint },

        headerLeft: () =>
          BackButton({ navigation: navigation, language: language }),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "CreateGame") {
            iconName = focused ? "duplicate" : "duplicate-outline";
          } else if (route.name === "JoinGame") {
            iconName = focused
              ? "arrow-redo-circle"
              : "arrow-redo-circle-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.fourth,
        tabBarInactiveTintColor: colors.primary,
        tabBarLabelStyle: { fontFamily: "CentraBook" },
      })}
    >
      <Tab.Screen
        name="CreateGame"
        component={CreateGameScreen}
        options={{ title: strings[language].createGame }}
      />
      <Tab.Screen
        name="JoinGame"
        component={JoinGameScreen}
        options={{ title: strings[language].joinGame }}
      />
    </Tab.Navigator>
  );
};
export default StartScreen;

const BackButton = ({ navigation, language }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", marginLeft: 2 }}
      onPress={() => navigation.navigate("Home")}
    >
      <Feather name={"chevron-left"} size={33} color={colors.white} />
      {Platform.OS === "ios" && (
        <Text
          style={{
            color: colors.white,
            fontSize: 18,
            fontFamily: "CentraBook",
          }}
        >
          {strings[language].back}
        </Text>
      )}
    </TouchableOpacity>
  );
};
