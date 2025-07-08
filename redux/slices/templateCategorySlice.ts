import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const getAllTemplateCategories = createAsyncThunk("templateCategory/getAllTemplateCategories", async (_, thunkAPI) => {
  const response = await axios.get(`${API_URL}/template-categories`);
  return response.data;
});

export const getTemplateCategoryById = createAsyncThunk("templateCategory/getTemplateCategoryById", async (id: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/template-categories/${id}`);
  return response.data;
});

export const createTemplateCategory = createAsyncThunk("templateCategory/createTemplateCategory", async (data: any, thunkAPI) => {
  const response = await axios.post(`${API_URL}/template-categories`, data);
  return response.data;
});

export const updateTemplateCategory = createAsyncThunk("templateCategory/updateTemplateCategory", async ({ id, data }: { id: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/template-categories/${id}`, data);
  return response.data;
});

export const deleteTemplateCategory = createAsyncThunk("templateCategory/deleteTemplateCategory", async (id: string, thunkAPI) => {
  const response = await axios.delete(`${API_URL}/template-categories/${id}`);
  return response.data;
});

const templateCategorySlice = createSlice({
  name: "templateCategory",
  initialState: {
    categories: [],
    category: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTemplateCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllTemplateCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
      .addCase(getAllTemplateCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch categories"; })
      .addCase(getTemplateCategoryById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getTemplateCategoryById.fulfilled, (state, action) => { state.loading = false; state.category = action.payload; })
      .addCase(getTemplateCategoryById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch category"; })
      .addCase(createTemplateCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createTemplateCategory.fulfilled, (state, action) => { state.loading = false; state.category = action.payload; })
      .addCase(createTemplateCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to create category"; })
      .addCase(updateTemplateCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateTemplateCategory.fulfilled, (state, action) => { state.loading = false; state.category = action.payload; })
      .addCase(updateTemplateCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update category"; })
      .addCase(deleteTemplateCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteTemplateCategory.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteTemplateCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to delete category"; });
  },
});

export default templateCategorySlice.reducer; 