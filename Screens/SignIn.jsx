import {
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import pwa from "../assets/Frame-2.png";
import avatar from "../assets/avatar.png";
import plus_icon from "../assets/plus-icon.png";
import { Icon, Input } from "@rneui/themed";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { MotiView } from "moti";
import { Styles } from "../Styles";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";
import api from "../utils/apiConfig/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
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
  const handleCreateAccount = async () => {
    if (number === "" || !number || name === "" || !name) {
      setisToastVisible(true);
      settoastContent("Phone number cannot be empty");
      return;
    }
    try {
      const response = await api.post("api/user/create", {
        number: number,
        name: name,
      });
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
        <View className=" h-2/5 relative">
          <Image source={pwa} className="w-full" />
          <View
            className="absolute bottom-2"
            style={{ left: responsiveWidth(35) }}
          >
            <View className="relative">
              <Image source={avatar} />
              <Image
                source={plus_icon}
                className="absolute bottom-0 right-0 w-8"
              />
            </View>
          </View>
        </View>
        <View style={Styles.centerView} className="pt-8">
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
          <View className="w-4/5 pt-10">
            <TextInput
              label="Full Name"
              className="mb-4"
              value={name}
              onChangeText={setName}
              keyboardType="name-phone-pad"
              mode="outlined"
              placeholder="Enter Full Name"
              leftIcon={
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
            <TextInput
              label="Phone Number"
              mode="outlined"
              value={number}
              onChangeText={setNumber}
              className="mb-8"
              keyboardType="name-phone-pad"
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
          </View>
          <View className="h-1/4">
            <TouchableOpacity
              style={Styles.customBackground}
              onPress={() => {
                handleCreateAccount();
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
          <View className="items-center justify-center flex-row flex-1">
            <View>
              <Text className="text-lg">You have an account? </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login Screen")}
            >
              <Text style={Styles.customColor} className="text-lg">
                Log In
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

export default SignIn;
