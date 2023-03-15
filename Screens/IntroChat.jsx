import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import moment from "moment/moment";
import React, { useState, useEffect } from "react";
import avatar from "../assets/avatar-1.png";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IntroChat = ({ name, id, number }) => {
  const [userId, setUserId] = useState();
  useEffect(() => {
    const getId = async () => {
      const data = await AsyncStorage.getItem("Id");
      setUserId(data);
    };
    getId();
  }, []);
  const navigation = useNavigation();
  return (
    <View className="w-[95%] mt-5 border-b-[1px] border-[#5A0FC8] self-center">
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("FullChat Screen", { name: name, id: id, number: number })
        }
      >
        <View className="flex-row items-center h-18">
          <View className="flex-2 mr-1">
            <Image source={avatar} />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold pb-1">
              {userId === id ? `${name} (You)` : name}
            </Text>
            <Text className="text-gray-400 pb-4">No recent chat</Text>
          </View>
          <View className="flex-2 mr-1">
            <Text className="pb-2">10min</Text>
            <View className="p-2 rounded-lg bg-[#5A0FC8]">
              <Text className="text-white text-center">2</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default IntroChat;
