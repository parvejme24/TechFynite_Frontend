import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const getAllBlogCategories = createAsyncThunk("blogCategory/getAllBlogCategories", async (_, thunkAPI) => {
  const response = await axios.get(`${API_URL}/blog-categories`);
  return response.data;
});

export const getBlogCategoryById = createAsyncThunk("blogCategory/getBlogCategoryById", async (id: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/blog-categories/${id}`);
  return response.data;
});

export const createBlogCategory = createAsyncThunk("blogCategory/createBlogCategory", async (data: any, thunkAPI) => {
  const response = await axios.post(`${API_URL}/blog-categories`, data);
  return response.data;
});

export const updateBlogCategory = createAsyncThunk("blogCategory/updateBlogCategory", async ({ id, data }: { id: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/blog-categories/${id}`, data);
  return response.data;
});

export const deleteBlogCategory = createAsyncThunk("blogCategory/deleteBlogCategory", async (id: string, thunkAPI) => {
  const response = await axios.delete(`${API_URL}/blog-categories/${id}`);
  return response.data;
});

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState: {
    categories: [],
    category: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllBlogCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
      .addCase(getAllBlogCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch categories"; })
      .addCase(getBlogCategoryById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getBlogCategoryById.fulfilled, (state, action) => { state.loading = false; state.category = action.payload; })
      .addCase(getBlogCategoryById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch category"; })
      .addCase(createBlogCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBlogCategory.fulfilled, (state, action) => { state.loading = false; state.category = action.payload; })
      .addCase(createBlogCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to create category"; })
      .addCase(updateBlogCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBlogCategory.fulfilled, (state, action) => { state.loading = false; state.category = action.payload; })
      .addCase(updateBlogCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update category"; })
      .addCase(deleteBlogCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteBlogCategory.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteBlogCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to delete category"; });
  },
});

export default blogCategorySlice.reducer; 