import { View, Text, Image, Keyboard } from "react-native";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import avatar from "../assets/avatar-1.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Message = ({ sender, message }) => {
  const [Id, setId] = useState();
  const [loadingId, setloadingId] = useState(true);
  const getId = async () => {
    const id = await AsyncStorage.getItem("Id");
    setId(id);
    setloadingId(false);
  };
  useEffect(() => {
    getId();
  }, []);
  return (
    <View className="w-[95%] my-4">
      {!loadingId &&
        (!(sender === Id) ? (
          <View className="flex-row items-center">
            <Image source={avatar} className="mr-2" />
            <View className="bg-[#AD87E4] rounded-3xl w-[85%] rounded-bl-none">
              <Text className="text-white p-2">{message}</Text>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center">
            <View className="bg-[#AD87E4] rounded-3xl w-[85%] rounded-br-none">
              <Text className="text-white p-2">{message}</Text>
            </View>
            <Image source={avatar} className="ml-2" />
          </View>
        ))}
    </View>
  );
};

export default Message;
