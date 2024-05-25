import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";
import { resetDatabase } from "../database";

const AppContext = createContext();

export default AppContext;

export const AppProvider = ({ children }) => {
  const baseState = {
    isOnboardingCompleted: false,
  };

  const [globalState, setGlobalState] = useState(baseState);

  const setOnboardingCompleted = async (value = true) => {
    setGlobalState((prev) => ({
      ...prev,
      isOnboardingCompleted: value,
    }));
  };

  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    setOnboardingCompleted(false);
  };

  const getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const currentUser = JSON.parse(user);
      setGlobalState((prev) => ({
        ...prev,
        user: currentUser,
      }));
      return currentUser;
    }
  };

  const updateUser = async (userObject) => {
    if (userObject) {
      const user = (await AsyncStorage.getItem("user")) || {};

      const updatedUser = { ...JSON.parse(user), ...userObject };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      setGlobalState((prev) => ({
        ...prev,
        ...{ user: updatedUser },
      }));
      return updatedUser;
    }
  };

  const resetApp = async (db) => {
    try {
      await AsyncStorage.clear();
      await resetDatabase(db);
      alert("App Async Storage & DB Reset. Please restart the app.");
    } catch (e) {
      alert("Error resetting DB and AsyncStorage...");
    }
  };

  return (
    <AppContext.Provider
      value={{
        globalState,
        setGlobalState,
        setOnboardingCompleted,
        logOut,
        getUser,
        updateUser,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
