import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const getAllBlogs = createAsyncThunk("blog/getAllBlogs", async (_, thunkAPI) => {
  const response = await axios.get(`${API_URL}/blogs`);
  return response.data;
});

export const getBlogById = createAsyncThunk("blog/getBlogById", async (id: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/blogs/${id}`);
  return response.data;
});

export const createBlog = createAsyncThunk("blog/createBlog", async (data: any, thunkAPI) => {
  const response = await axios.post(`${API_URL}/blogs`, data);
  return response.data;
});

export const updateBlog = createAsyncThunk("blog/updateBlog", async ({ id, data }: { id: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/blogs/${id}`, data);
  return response.data;
});

export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id: string, thunkAPI) => {
  const response = await axios.delete(`${API_URL}/blogs/${id}`);
  return response.data;
});

export const likeBlog = createAsyncThunk("blog/likeBlog", async (id: string, thunkAPI) => {
  const response = await axios.post(`${API_URL}/blogs/${id}/like`);
  return response.data;
});

export const unlikeBlog = createAsyncThunk("blog/unlikeBlog", async (id: string, thunkAPI) => {
  const response = await axios.post(`${API_URL}/blogs/${id}/unlike`);
  return response.data;
});

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    blog: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllBlogs.fulfilled, (state, action) => { state.loading = false; state.blogs = action.payload; })
      .addCase(getAllBlogs.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch blogs"; })
      .addCase(getBlogById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getBlogById.fulfilled, (state, action) => { state.loading = false; state.blog = action.payload; })
      .addCase(getBlogById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch blog"; })
      .addCase(createBlog.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBlog.fulfilled, (state, action) => { state.loading = false; state.blog = action.payload; })
      .addCase(createBlog.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to create blog"; })
      .addCase(updateBlog.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBlog.fulfilled, (state, action) => { state.loading = false; state.blog = action.payload; })
      .addCase(updateBlog.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update blog"; })
      .addCase(deleteBlog.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteBlog.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteBlog.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to delete blog"; })
      .addCase(likeBlog.fulfilled, (state, action) => { state.blog = action.payload; })
      .addCase(unlikeBlog.fulfilled, (state, action) => { state.blog = action.payload; });
  },
});

export default blogSlice.reducer; 