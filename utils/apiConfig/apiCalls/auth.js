import api from "../api";

const getAuthStatus = async () => {
  try {
    const response = await api.get("/api/user/info");
    const data = response.data;
    console.log(data);
    if (response.data.message === "User found") return data;
  } catch (error) {
    console.log("error");
  }
};

export { getAuthStatus };
