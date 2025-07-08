import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const getAllUsers = createAsyncThunk("user/getAllUsers", async (_, thunkAPI) => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
});

export const getUserById = createAsyncThunk("user/getUserById", async (id: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
});

export const updateUser = createAsyncThunk("user/updateUser", async ({ id, data }: { id: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/users/${id}`, data);
  return response.data;
});

export const updateUserRole = createAsyncThunk("user/updateUserRole", async ({ id, role }: { id: string; role: string }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/users/${id}/role`, { role });
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(getAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch users"; })
      .addCase(getUserById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getUserById.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(getUserById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch user"; })
      .addCase(updateUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update user"; })
      .addCase(updateUserRole.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUserRole.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(updateUserRole.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update user role"; });
  },
});

export default userSlice.reducer; 