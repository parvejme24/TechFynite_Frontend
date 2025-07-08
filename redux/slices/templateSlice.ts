import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const getAllTemplates = createAsyncThunk("template/getAllTemplates", async (_, thunkAPI) => {
  const response = await axios.get(`${API_URL}/templates`);
  return response.data;
});

export const getTemplateById = createAsyncThunk("template/getTemplateById", async (id: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/templates/${id}`);
  return response.data;
});

export const createTemplate = createAsyncThunk("template/createTemplate", async (data: any, thunkAPI) => {
  const response = await axios.post(`${API_URL}/templates`, data);
  return response.data;
});

export const updateTemplate = createAsyncThunk("template/updateTemplate", async ({ id, data }: { id: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/templates/${id}`, data);
  return response.data;
});

export const deleteTemplate = createAsyncThunk("template/deleteTemplate", async (id: string, thunkAPI) => {
  const response = await axios.delete(`${API_URL}/templates/${id}`);
  return response.data;
});

const templateSlice = createSlice({
  name: "template",
  initialState: {
    templates: [],
    template: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTemplates.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllTemplates.fulfilled, (state, action) => { state.loading = false; state.templates = action.payload; })
      .addCase(getAllTemplates.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch templates"; })
      .addCase(getTemplateById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getTemplateById.fulfilled, (state, action) => { state.loading = false; state.template = action.payload; })
      .addCase(getTemplateById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch template"; })
      .addCase(createTemplate.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createTemplate.fulfilled, (state, action) => { state.loading = false; state.template = action.payload; })
      .addCase(createTemplate.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to create template"; })
      .addCase(updateTemplate.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateTemplate.fulfilled, (state, action) => { state.loading = false; state.template = action.payload; })
      .addCase(updateTemplate.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update template"; })
      .addCase(deleteTemplate.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteTemplate.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteTemplate.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to delete template"; });
  },
});

export default templateSlice.reducer; 