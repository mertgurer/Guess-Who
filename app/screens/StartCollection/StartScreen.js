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
        headerStyle: {
          backgroundColor: colors.primary,
        },
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: colors.primary,
          height: Platform.OS === "ios" ? 90 : 70,
          ...(Platform.OS === "android" && { paddingBottom: 10 }),
        },
        tabBarLabelStyle: { fontFamily: "CentraMedium", fontSize: 12 },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.halfBlack,
        headerLeft: () => BackButton({ navigation: navigation }),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "CreateGame") {
            iconName = focused ? "duplicate" : "duplicate-outline";
          } else if (route.name === "JoinGame") {
            iconName = focused
              ? "arrow-redo-circle"
              : "arrow-redo-circle-outline";
          }
          return (
            <Ionicons
              style={{ paddingTop: 5 }}
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
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
        options={{ title: strings[language].joinGame, headerShown: false }}
      />
    </Tab.Navigator>
  );
};
export default StartScreen;

const BackButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 2,
        left: 10,
      }}
      onPress={() => navigation.navigate("Home")}
    >
      <Feather name={"chevron-left"} size={33} color={colors.white} />
    </TouchableOpacity>
  );
};
