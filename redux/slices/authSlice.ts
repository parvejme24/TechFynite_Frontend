import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const register = createAsyncThunk(
  "register",
  async (
    data: { email: string; password: string; displayName: string },
    thunkAPI
  ) => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  }
);

export const login = createAsyncThunk(
  "login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  }
);

export const verifyOtp = createAsyncThunk(
  "verifyOtp",
  async (data: { email: string; otp: string }, thunkAPI) => {
    const response = await axios.post(`${API_URL}/verify-otp`, data);
    return response.data;
  }
);

export const refreshToken = createAsyncThunk(
  "refreshToken",
  async (data: { refreshToken: string }, thunkAPI) => {
    const response = await axios.post(`${API_URL}/refresh-token`, data);
    return response.data;
  }
);

export const resetPasswordRequest = createAsyncThunk(
  "resetPasswordRequest",
  async (data: { email: string }, thunkAPI) => {
    const response = await axios.post(
      `${API_URL}/reset-password-request`,
      data
    );
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (
    data: { email: string; otp: string; newPassword: string },
    thunkAPI
  ) => {
    const response = await axios.post(`${API_URL}/reset-password`, data);
    return response.data;
  }
);

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
});

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null as string | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Register failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "OTP verification failed";
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Token refresh failed";
      })
      .addCase(resetPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Reset password request failed";
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Reset password failed";
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Logout failed";
      });
  },
});

export default authSlice.reducer;
