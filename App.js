import Main from "./Main";
import store from "./utils/redux/store";
import { Provider } from "react-redux";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <Main />
      </RootSiblingParent>
    </Provider>
  );
}
