import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  shippingCost: 0,
};

export const getShippingCost = createAsyncThunk(
  "/settings/getShippingCost",
  async () => {
    const res = await axios.get(
      `http://localhost:5000/api/admin/settings/shippingCost`
    );
    return res.data;
  }
);

export const setShippingCost = createAsyncThunk(
  "/settings/setShippingCost",
  async (value) => {
    const res = await axios.put(
      `http://localhost:5000/api/admin/settings/shippingCost`,
      { value }
    );
    return res.data;
  }
);

const SettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShippingCost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShippingCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippingCost = action.payload?.data?.value || 0;
      })
      .addCase(getShippingCost.rejected, (state) => {
        state.isLoading = false;
        state.shippingCost = 0;
      })
      .addCase(setShippingCost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setShippingCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippingCost = action.payload?.data?.value || 0;
      })
      .addCase(setShippingCost.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default SettingsSlice.reducer;
