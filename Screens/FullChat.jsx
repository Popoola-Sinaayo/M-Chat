import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Icon, Input } from "@rneui/themed";
import { TextInput } from "react-native-paper";
import {
  useResponsiveHeight,
  useResponsiveScreenHeight,
} from "react-native-responsive-dimensions";
import Message from "./Message";
import Toast from "react-native-root-toast";
import api from "../utils/apiConfig/api";
import { getToken } from "../utils/apiConfig/api";
import { ListEmptyComponent } from "./AllChats";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "../utils/socket/socket";

const FullChat = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const route = useRoute();
  const { name, id, number } = route?.params;
  const [messageText, setMessageText] = useState();
  const [messages, setMessages] = useState([]);
  const [isToastVisible, setisToastVisible] = useState(false);
  const [toastContent, settoastContent] = useState("");
  const fetchMessages = async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/messages/fetch", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messages = response.data;
      setMessages(messages.data);
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.log(error);
      setisToastVisible(true);
      settoastContent("An Error Occured while fetching messages");
    }
  };
  const handleSendMessage = async () => {
    if (!messageText) {
      setisToastVisible(true);
      settoastContent("Message Cannot Be Empty");
      return;
    }
    try {
      const senderId = await AsyncStorage.getItem("Id");
      const token = await getToken();
      const response = await api.post("/api/messages/create", {
        sender: senderId,
        receiver: id,
        message: messageText,
      });
      const data = response.data;
      console.log(data);
      setMessageText("");
      setMessages((previousMessage) => {
        return [...previousMessage, data.data];
      });

      socket.emit("newMessageToServer", { roomId: id, message: data });
    } catch (error) {
      console.log(error);
      setisToastVisible(true);
      settoastContent("An Error Occured while sending messages");
    }
  };
  useEffect(() => {
    const getId = async () => {
      const data = await AsyncStorage.getItem("Id");
      socket.emit("createroom", data);
    };
    if (socket.connected) {
      socket.on("newMessageToClient", (data) => {
        console.log(data, "for client");
        setMessages((previousMessage) => {
          return [...previousMessage, data.data];
        });
      });
    }
    getId();
  }, []);
  useEffect(() => {
    fetchMessages();
  }, []);

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
  useEffect(() => {
    console.log("message updated");
    if (messages.length > 0) {
      console.log("message greaterthan");
      console.log("scrolled");
      return flatListRef.current.scrollToEnd();
    }
  }, [messages]);

  return (
    <View
      style={{
        height: useResponsiveScreenHeight(100),
        width: "100%",
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        className="bg-[#5A0FC8] flex-row pt-10 justify-between"
        style={{ height: useResponsiveScreenHeight(16) }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <Icon name="arrow-back" type="ionicon" color="white" size={30} />
          </View>
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-white">{name}</Text>
          <Text className="text-white">+{number}</Text>
        </View>
        <View>
          <Icon name="notifications" type="ionicon" color="white" size={30} />
        </View>
        <View>
          <Icon
            name="ellipsis-vertical"
            type="ionicon"
            color="white"
            size={30}
          />
        </View>
      </View>
      <View className=" bg-white -mt-8 rounded-t-[40px] pt-8 relative w-full flex-1 mb-20">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          className="flex-1"
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Message sender={item?.sender} message={item?.message} />
            )}
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              messages.length > 0 && flatListRef.current?.scrollToEnd();
            }}
            ListEmptyComponent={ListEmptyComponent}
          />
        </TouchableWithoutFeedback>
      </View>
      <Toast
        visible={isToastVisible}
        position={200}
        shadow={false}
        animation={false}
        hideOnPress={true}
      >
        {toastContent}
      </Toast>
      <View
        className="absolute bottom-4 w-[95%] border-b-0 bg-white self-center shadow-2xl rounded-full"
        style={{ elevation: 20 }}
      >
        <TextInput
          className="rounded-full border-b-0 bg-white"
          mode="flat"
          value={messageText}
          underlineColor="transparent"
          onChangeText={setMessageText}
          placeholder="Enter Message here"
          left={
            <TextInput.Icon
              icon={() => {
                return (
                  <TouchableOpacity>
                    <Icon
                      name="happy-outline"
                      type="ionicon"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          }
          right={
            <TextInput.Icon
              icon={() => {
                return (
                  <TouchableOpacity
                    className="bg-[#5A0FC8] p-2"
                    onPress={() => {
                      handleSendMessage();
                    }}
                  >
                    <Icon
                      name="paper-plane"
                      type="font-awesome"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          }
        />
      </View>
    </View>
  );
};

export default FullChat;
