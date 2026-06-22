import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  reviewList: [],
  isLoading: false,
};

export const getAllReviewsForAdmin = createAsyncThunk(
  "/reviews/getAllReviewsForAdmin",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/admin/reviews/get",
    );

    return response.data;
  },
);

export const updateReviewApprovalStatus = createAsyncThunk(
  "/reviews/updateReviewApprovalStatus",
  async ({ id, isApproved }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/reviews/update/${id}`,
      { isApproved },
    );

    return response.data;
  },
);

export const deleteReviewForAdmin = createAsyncThunk(
  "/reviews/deleteReviewForAdmin",
  async (id) => {
    const response = await axios.delete(
      `http://localhost:5000/api/admin/reviews/delete/${id}`,
    );

    return { ...response.data, deletedId: id };
  },
);

const adminReviewSlice = createSlice({
  name: "adminReviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviewsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviewsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewList = action.payload.data || [];
      })
      .addCase(getAllReviewsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.reviewList = [];
      })
      .addCase(updateReviewApprovalStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        if (!updated || !updated._id) return;
        state.reviewList = state.reviewList.map((item) =>
          item._id === updated._id ? updated : item,
        );
      })
      .addCase(deleteReviewForAdmin.fulfilled, (state, action) => {
        const deletedId = action.payload.deletedId;
        if (!deletedId) return;
        state.reviewList = state.reviewList.filter(
          (item) => item._id !== deletedId,
        );
      });
  },
});

export default adminReviewSlice.reducer;
