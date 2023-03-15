import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Login,
  Verification,
  SignIn,
  AllChats,
  IntroChat,
  FullChat,
} from "./Screens";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAuth } from "./utils/redux/slicers/authSlicer";
import * as SplashScreen from "expo-splash-screen";
import { getToken } from "./utils/apiConfig/api";

SplashScreen.preventAutoHideAsync();

export default function Main() {
  console.log(process.env.URL);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authSlicer.loading);
  const authStatus = useSelector((state) => state.authSlicer.isAuthenticated);
  useEffect(() => {
    console.log(getToken());
    dispatch(fetchAuth());
  }, []);
  console.log(getToken(), "from main");
  useEffect(() => {
    if (loading !== "loading") {
      SplashScreen.hideAsync();
    }
    async () => {
      if (loading !== "loading") {
        await SplashScreen.hideAsync();
      }
      if (loading === "falied") {
        await AsyncStorage.clear();
        return;
      }
    };
  }, [loading]);
  console.log(loading);
  console.log(authStatus);
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      {!authStatus ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login Screen"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verification Screen"
            component={Verification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn Screen"
            component={SignIn}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="AllChats Screen"
            component={AllChats}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IntroChat Screen"
            component={IntroChat}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="FullChat Screen"
            component={FullChat}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
