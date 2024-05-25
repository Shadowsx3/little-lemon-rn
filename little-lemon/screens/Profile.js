import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "../data/AppContext";
import { colors } from "../constants/color";
import CustomButton from "../components/CustomButton";
import Avatar from "../components/Avatar";
import CheckBox from "../components/CheckBox";
import CustomTextInput from "../components/CustomTextInput";
import { database } from "../database";

const initialNotificationPrefState = {
  orderStatus: true,
  password: true,
  offers: true,
  newsletter: true,
};

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [notificationPref, setNotificationPref] = useState(
    initialNotificationPrefState
  );
  const { logOut, updateUser, globalState, setOnboardingCompleted, resetApp } =
    useContext(AppContext);

  const { user } = globalState;

  const setProfileValues = async (userAsyncStorage) => {
    const { firstName, email, lastName, phoneNumber, notificationPref } =
      userAsyncStorage;
    setFirstName(firstName);
    setLastName(lastName || null);
    setEmail(email);
    setPhoneNumber(phoneNumber || null);
    setNotificationPref(notificationPref || initialNotificationPrefState);
  };

  const loadProfileData = async () => {
    try {
      const jsonString = await AsyncStorage.getItem("user");
      if (!jsonString) return;
      await setProfileValues(JSON.parse(jsonString));
    } catch (error) {
      console.log("Error loading profile data:", error);
      return;
    }
  };

  const saveProfileChanges = async () => {
    setOnboardingCompleted(true);
    try {
      updateUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        notificationPref,
      });
      navigateToHomeScreen();
    } catch (error) {
      alert("Error saving profile changes");
      console.error(error);
    }
  };

  const discardProfileChanges = async () => {
    loadProfileData();
    alert("Changes discarded");
  };

  const changeNotificationPref = (key, value) => {
    setNotificationPref((prev) => ({ ...prev, [key]: value }));
  };

  const navigateToHomeScreen = () => navigation.replace("Home");

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Personal Information</Text>
          <Avatar user={user} />
          <CustomTextInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.CustomTextInput}
          />
          <CustomTextInput
            value={lastName}
            label="Last name"
            placeholder="Doe..."
            onChangeText={setLastName}
            style={styles.CustomTextInput}
          />
          <CustomTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            inputMode="email"
            keyboardType="email-address"
            style={styles.CustomTextInput}
          />
          <CustomTextInput
            value={phoneNumber}
            label="Phone number"
            placeholder="(000) 000-0000"
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
            style={styles.CustomTextInput}
          />

          <Text style={styles.notificationHeaderText}>Email notifications</Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              text={"Order status"}
              value={notificationPref.orderStatus}
              onValueChange={(value) =>
                changeNotificationPref("orderStatus", value)
              }
            />
            <CheckBox
              text={"Password changes"}
              value={notificationPref.password}
              onValueChange={(value) =>
                changeNotificationPref("password", value)
              }
            />
            <CheckBox
              text={"Special offers"}
              value={notificationPref.offers}
              onValueChange={(value) => changeNotificationPref("offers", value)}
            />
            <CheckBox
              text={"Newsletter"}
              value={notificationPref.newsletter}
              onValueChange={(value) =>
                changeNotificationPref("newsletter", value)
              }
            />
          </View>
          <CustomButton
            text="Log out"
            style={styles.logOutButton}
            textStyle={styles.logOutButtonText}
            onPress={logOut}
          />
          <View style={styles.buttonRow}>
            <CustomButton
              text="Discard Changes"
              onPress={discardProfileChanges}
              style={styles.discardButton}
              textStyle={styles.discardButtonText}
            />
            <CustomButton text="Save Changes" onPress={saveProfileChanges} />
          </View>
          <CustomButton
            text="RESET APP"
            onPress={() => {
              resetApp(database);
            }}
            style={styles.resetButton}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    gap: 10,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 20,
    color: colors.BLACK,
  },
  CustomTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BLACK,
    marginBottom: 15,
    padding: 10,
  },
  notificationHeaderText: {
    fontWeight: "600",
    fontSize: 15,
    color: colors.BLACK,
  },
  checkboxContainer: {
    flexDirection: "column",
    gap: 15,
  },
  logOutButton: {
    backgroundColor: colors.YELLOW,
    borderColor: colors.YELLOW,
  },
  logOutButtonText: {
    color: colors.BLACK,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 20,
  },
  discardButton: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: colors.GREEN,
  },
  discardButtonText: {
    color: colors.BLACK,
  },
  resetButton: {
    backgroundColor: "red",
    borderWidth: 0,
    width: 200,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default ProfileScreen;
