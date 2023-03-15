import {
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import pwa from "../assets/Frame-1.png";
import { Icon, Input } from "@rneui/themed";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import db from "../utils/db/db";
import { MotiView } from "moti";
import { Styles } from "../Styles";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAuthentication } from "../utils/redux/slicers/authSlicer";
import { TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";
import api from "../utils/apiConfig/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAuth } from "../utils/redux/slicers/authSlicer";

const Verification = ({ navigation }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authSlicer.isAuthenticated);
  console.log(isAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [isToastVisible, setisToastVisible] = useState(false);
  const [toastContent, settoastContent] = useState("Hello Toast");
  const [docs, setDocs] = useState([]);
  const [otp, setOtp] = useState("");
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

  const handleVerify = async () => {
    const id = await AsyncStorage.getItem("Id");
    console.log(otp);
    console.log(id);
    try {
      const response = await api.post("/api/user/verify", {
        otp: parseInt(otp),
        id: id,
      });
      const data = response.data;
      console.log(data);
      if (data.message === "User verification complete") {
        console.log(data.token);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.setItem("token", data.token);
        dispatch(setAuthentication({ auth: true, username: "" }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isAuth) {
      navigation.navigate("AllChats Screen");
    }
  }, [isAuth]);
  return (
    <TouchableWithoutFeedback
      className="flex-1"
      onPress={() => Keyboard.dismiss()}
    >
      <MotiView
        from={{ opacity: 0, translateY: -responsiveHeight(10) }}
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
            <View className="w-2/4 mr-1">
              <View className="items-center">
                <TouchableOpacity>
                  <View className="flex-row">
                    <Icon name="log-in-outline" type="ionicon" />
                    <Text className="text-xl ml-2">Login</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View className="border-b-2 border-[#5A0FC8] w-2/4 ml-1">
              <View className="items-center">
                <View className="flex-row">
                  <Icon
                    name="shield-checkmark"
                    type="ionicon"
                    color={"#5A0FC8"}
                  />
                  <Text className="text-xl ml-1">Verification</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="w-4/5 pt-10">
            <TextInput
              label="Verification"
              mode="outlined"
              keyboardType="numeric"
              onChangeText={setOtp}
              placeholder="Enter Verification Number"
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
          <View className="h-1/5 justify-center">
            <TouchableOpacity
              style={Styles.customBackground}
              onPress={() => {
                handleVerify();
              }}
            >
              <View className="flex-row items-center">
                <Icon name="log-in-outline" type="ionicon" s color="white" />
                <Text className="text-lg ml-3 text-white">Login</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="h-1/3 items-center">
            <Text className="text-lg">
              Did Not Receive Code?{" "}
              <Text style={Styles.customColor}>Try Again</Text>
            </Text>
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

export default Verification;
