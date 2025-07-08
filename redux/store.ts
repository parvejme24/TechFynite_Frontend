// Redux Slice Imports
import authReducer from "./slices/authSlice";
import blogCategoryReducer from "./slices/blogCategorySlice";
import blogReducer from "./slices/blogSlice";
import blogReviewReducer from "./slices/blogReviewSlice";
import templateCategoryReducer from "./slices/templateCategorySlice";
import templateReducer from "./slices/templateSlice";
import userReducer from "./slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";

// Redux Store Setup
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,

    blogCategory: blogCategoryReducer,
    blog: blogReducer,
    blogReview: blogReviewReducer,

    template: templateReducer,
    templateCategory: templateCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
