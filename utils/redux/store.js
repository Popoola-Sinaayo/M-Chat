import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicers/authSlicer";

export default configureStore({
  reducer: {
    authSlicer: authSlicer
  },
});
