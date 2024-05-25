import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../data/AppContext";
import OnboardingScreen from "../screens/Onboarding";
import HomeScreen from "../screens/Home";
import SplashScreen from "../screens/SplashScreen";
import ProfileScreen from "../screens/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import Avatar from "../components/Avatar";
import {
  database,
  checkMenuTableAndPopulateData,
  selectAllMenu,
  resetDatabase,
} from "../database";
import * as Font from "expo-font";
import Markazi from "../assets/MarkaziText-Regular.ttf";
import Karla from "../assets/Karla-Regular.ttf";

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const { globalState, setOnboardingCompleted, getUser } =
    useContext(AppContext);
  const { isOnboardingCompleted } = globalState;
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded] = Font.useFonts({
    Markazi,
    Karla,
  });

  const loadApp = async () => {
    if (!fontLoaded) return;
    try {
      const user = await getUser();
      if (user) {
        setOnboardingCompleted(true);
      }
      const existingMenuItems = await selectAllMenu(database);
      if (user && existingMenuItems.length) {
        setIsLoading(false);
        return;
      }
      await checkMenuTableAndPopulateData(database);
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApp();
  }, [fontLoaded]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingCompleted ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                headerTitle: (props) => <Header {...props} />,
                headerRight: () => (
                  <Avatar
                    onPress={() => navigation.navigate("Profile")}
                    onlyAvatar={true}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerTitle: (props) => <Header {...props} /> }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerTitle: (props) => <Header {...props} /> }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
