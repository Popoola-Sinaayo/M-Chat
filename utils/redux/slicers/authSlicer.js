import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getToken } from "../../apiConfig/api";

export const authSlice = createSlice({
  name: "authSlicer",
  initialState: {
    isAuthenticated: false,
    username: "",
    loading: "idle",
    error: null,
    isDone: false,
  },
  reducers: {
    setAuthentication: (state, action) => {
      (state.isAuthenticated = action.payload.auth),
        (state.username = action.payload.username);
    },
    setIsDone: (state, action) => {
      state.isDone = action;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAuth.pending, (state, action) => {
        state.loading = "loading";
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.isAuthenticated = action.payload.isAuth;
        state.username = action.payload.username;
      })
      .addCase(fetchAuth.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchAuth = createAsyncThunk("getAuthStatus", async () => {
  const token = await getToken();
  const response = await api.get("/api/user/info", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.data.message === "error") {
    return { isAuth: false, username: "" };
  } else {
    return { isAuth: true, username: response.data.data.name };
  }
});

export const { setAuthentication, setIsDone } = authSlice.actions;

export default authSlice.reducer;
