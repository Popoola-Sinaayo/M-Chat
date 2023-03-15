import { io } from "socket.io-client";

const URL = "http://192.168.43.34:5000";

export const socket = io(URL);