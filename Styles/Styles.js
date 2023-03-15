import { StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const Styles = StyleSheet.create({
  centerView: {
    alignItems: "center",
    width: responsiveWidth(100),
  },
  customBackground: {
    backgroundColor: "#5A0FC8",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  customColor: {
    color: "#5A0FC8",
  },
});

export default Styles;
