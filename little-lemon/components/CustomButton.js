import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../constants/color";

const CustomButton = ({ text, style, textStyle, ...props }) => {
  return (
    <Pressable style={[styles.button, style]} {...props}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.GREEN,
    borderColor: colors.GREEN,
    borderWidth: 2,
  },
  buttonText: {
    color: colors.GRAY,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;
