import Datastore from "react-native-local-mongodb";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = new Datastore({
  storage: AsyncStorage,
});

export default db;
