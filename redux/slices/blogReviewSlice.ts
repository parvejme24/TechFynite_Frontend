import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../apiConfig";

export const getBlogReviewsByBlogId = createAsyncThunk("blogReview/getBlogReviewsByBlogId", async (blogId: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/blog-review/${blogId}`);
  return response.data;
});

export const getBlogReviewById = createAsyncThunk("blogReview/getBlogReviewById", async (reviewId: string, thunkAPI) => {
  const response = await axios.get(`${API_URL}/blog-review/review/${reviewId}`);
  return response.data;
});

export const createBlogReview = createAsyncThunk("blogReview/createBlogReview", async (data: any, thunkAPI) => {
  const response = await axios.post(`${API_URL}/blog-review`, data);
  return response.data;
});

export const updateBlogReview = createAsyncThunk("blogReview/updateBlogReview", async ({ reviewId, data }: { reviewId: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/blog-review/${reviewId}`, data);
  return response.data;
});

export const deleteBlogReview = createAsyncThunk("blogReview/deleteBlogReview", async (reviewId: string, thunkAPI) => {
  const response = await axios.delete(`${API_URL}/blog-review/${reviewId}`);
  return response.data;
});

export const replyToBlogReview = createAsyncThunk("blogReview/replyToBlogReview", async ({ reviewId, data }: { reviewId: string; data: any }, thunkAPI) => {
  const response = await axios.post(`${API_URL}/blog-review/${reviewId}/reply`, data);
  return response.data;
});

export const updateBlogReviewReply = createAsyncThunk("blogReview/updateBlogReviewReply", async ({ reviewId, data }: { reviewId: string; data: any }, thunkAPI) => {
  const response = await axios.put(`${API_URL}/blog-review/${reviewId}/reply`, data);
  return response.data;
});

const blogReviewSlice = createSlice({
  name: "blogReview",
  initialState: {
    reviews: [],
    review: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogReviewsByBlogId.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getBlogReviewsByBlogId.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
      .addCase(getBlogReviewsByBlogId.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch reviews"; })
      .addCase(getBlogReviewById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getBlogReviewById.fulfilled, (state, action) => { state.loading = false; state.review = action.payload; })
      .addCase(getBlogReviewById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch review"; })
      .addCase(createBlogReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBlogReview.fulfilled, (state, action) => { state.loading = false; state.review = action.payload; })
      .addCase(createBlogReview.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to create review"; })
      .addCase(updateBlogReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBlogReview.fulfilled, (state, action) => { state.loading = false; state.review = action.payload; })
      .addCase(updateBlogReview.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update review"; })
      .addCase(deleteBlogReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteBlogReview.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteBlogReview.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to delete review"; })
      .addCase(replyToBlogReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(replyToBlogReview.fulfilled, (state, action) => { state.loading = false; state.review = action.payload; })
      .addCase(replyToBlogReview.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to reply to review"; })
      .addCase(updateBlogReviewReply.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBlogReviewReply.fulfilled, (state, action) => { state.loading = false; state.review = action.payload; })
      .addCase(updateBlogReviewReply.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to update review reply"; });
  },
});

export default blogReviewSlice.reducer; 