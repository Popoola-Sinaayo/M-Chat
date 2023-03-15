import {
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import pwa from "../assets/Frame.png";
import { Icon, Input } from "@rneui/themed";
import Toast from "react-native-root-toast";
import db from "../utils/db/db";
import { TextInput, ActivityIndicator, MD2Colors } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { MotiView } from "moti";
import { Styles } from "../Styles";
import { TouchableOpacity } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Platform } from "react-native";
import api from "../utils/apiConfig/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const [number, setNumber] = useState("");
  const [isToastVisible, setisToastVisible] = useState(false);
  const [toastContent, settoastContent] = useState("Hello Toast");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let timeOut = setTimeout(() => {
      if (isToastVisible) {
        setisToastVisible(false);
      }
    }, 5000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [isToastVisible]);
  useEffect(() => {}, []);
  const handleLogin = async () => {
    if (number === "" || !number) {
      setisToastVisible(true);
      settoastContent("Phone number cannot be empty");
      return;
    }
    try {
      const response = await api.post("api/user/login", { number: number });
      const data = response.data;
      console.log(data);
      if (data.message === "success") {
        setisToastVisible(true);
        settoastContent(`Login Successful, this is your otp ${data.data.otp}`);
        console.log(data.data._id);
        await AsyncStorage.setItem("Id", data.data._id);
        navigation.navigate("Verification Screen");
      } else {
        setisToastVisible(true);
        settoastContent(data.message);
      }
    } catch (error) {
      console.log(error?.response?.status);
      setisToastVisible(true);
      if (error?.response?.status === 404) {
        settoastContent("Number not registered");
      } else {
        settoastContent("An error occured while signing in");
      }
    }
  };
  return (
    <TouchableWithoutFeedback
      className="flex-1"
      onPress={() => Keyboard.dismiss()}
    >
      <MotiView
        from={{ opacity: 0, translateY: responsiveHeight(20) }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          // default settings for all style values
          type: "timing",
          duration: 350,
          // set a custom transition for scale
          translateY: {
            type: "spring",
            delay: 100,
          },
        }}
        style={{ flex: 1 }}
      >
        <View className="h-3/6">
          <Image source={pwa} className="w-full" />
        </View>
        <View className="pl-3 pb-4">
          <Text className="text-2xl">Login To Your Account</Text>
        </View>
        <View style={Styles.centerView}>
          <View className="flex-row justify-between w-11/12">
            <View className="border-b-2 border-[#5A0FC8] w-2/4 mr-1">
              <View className="items-center">
                <View className="flex-row">
                  <Icon name="log-in-outline" type="ionicon" color="#5A0FC8" />
                  <Text className="text-xl ml-2">Login</Text>
                </View>
              </View>
            </View>
            <View className="w-2/4 ml-1">
              <View className="items-center">
                <TouchableOpacity>
                  <View className="flex-row">
                    <Icon name="shield-checkmark" type="ionicon" />
                    <Text className="text-xl ml-1">Verification</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <KeyboardAvoidingView
            className="w-4/5 pt-10 pb-8"
            keyboardVerticalOffset={headerHeight + 64}
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
            enabled
          >
            <TextInput
              label="Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              // keyboardType="name-phone-pad"
              value={number}
              onChangeText={setNumber}
              placeholder="+43-234345-23"
              left={
                <TextInput.Icon
                  icon={() => {
                    return (
                      <Icon
                        name="call-outline"
                        type="ionicon"
                        size={24}
                        color="black"
                      />
                    );
                  }}
                />
              }
            />
          </KeyboardAvoidingView>
          <View className="h-1/5 justify-center">
            <TouchableOpacity
              style={Styles.customBackground}
              onPress={() => {
                handleLogin();
              }}
            >
              <View className="flex-row items-center">
                <Icon
                  name="play-forward-outline"
                  type="ionicon"
                  color="white"
                />
                <Text className="text-lg ml-3 text-white">Next Step</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="h-1/4 items-center justify-center flex-row flex-1">
            <View>
              <Text className="text-lg">Don't have an account? </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn Screen")}
            >
              <Text style={Styles.customColor} className="text-lg">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast
          visible={isToastVisible}
          position={50}
          shadow={false}
          animation={false}
          hideOnPress={true}
        >
          {toastContent}
        </Toast>
      </MotiView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
