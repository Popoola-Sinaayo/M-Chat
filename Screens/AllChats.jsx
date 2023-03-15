import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-paper";
import { MotiView } from "moti";
import { Styles } from "../Styles";
import { Icon } from "@rneui/themed";
import IntroChat from "./IntroChat";
import avatar from "../assets/avatar-1.png";
import api, { getToken } from "../utils/apiConfig/api";
import { setAuthentication } from "../utils/redux/slicers/authSlicer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

const AllChats = ({ navigation }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [showMiniNav, setShowMiniNav] = useState(false);
  async function handleLogout() {
    try {
      await AsyncStorage.clear(() => {
        dispatch(setAuthentication({ auth: false, username: "" }));
        navigation.navigate("Login Screen");
      });
    } catch (error) {
      console.log(error);
    }
  }
  const fetchAllUsers = async () => {
    const token = await getToken();
    const response = await api.get("/api/user/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    console.log(data);
    setUsers(data.data);
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log(users);
  return (
    <View className="flex-1">
      <View className="mt- bg-[#7B3FD3] justify-center rounded-t-2xl rounded-b-3xl h-1/4">
        <View style={Styles.centerView}>
          <View className="w-11/12">
            <View className="flex-row justify-between">
              <Text className="text-white text-2xl pb-6">
                PROGRASIVE WEB APP
              </Text>
              <TouchableWithoutFeedback
                onPress={() => setShowMiniNav(!showMiniNav)}
              >
                <Icon
                  name="ellipsis-vertical"
                  type="ionicon"
                  color="white"
                  size={30}
                />
              </TouchableWithoutFeedback>
            </View>
            <TextInput
              className="rounded-full"
              placeholder="Search"
              left={
                <TextInput.Icon
                  icon={() => {
                    return (
                      <Icon
                        name="search-outline"
                        type="ionicon"
                        size={24}
                        color="black"
                      />
                    );
                  }}
                />
              }
              right={
                <TextInput.Icon
                  icon={() => {
                    return (
                      <View className="bg-[#3E0A8C] rounded-full p-[15px]">
                        <Text className="text-white text-[11px]">A</Text>
                      </View>
                    );
                  }}
                />
              }
            />
          </View>
        </View>
      </View>
      <View className="flex-1 w-full">
        <FlatList
          data={users}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => {
            return (
              <IntroChat name={item.name} id={item._id} number={item.number} />
            );
          }}
          keyExtractor={(item) => item._id}
        />
      </View>
      {showMiniNav && (
        <View className="absolute top-[90px] right-14 bg-white p-4">
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}
          >
            <Text className="text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const ListEmptyComponent = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>No Chat Available</Text>
    </View>
  );
};

export default AllChats;
