import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const axiosInstance = axios.create({
  baseURL: "http://192.168.43.34:5000",
});

const getToken = async () => {
  const token = await AsyncStorage.getItem("token", () => {
    // dispatch(setIsDone);
  });

  return token;
};
export { getToken };

export default axiosInstance;
