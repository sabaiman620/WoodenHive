import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "@/lib/api";

const initialState = {
  isLoading: false,
  isCancellingOrder: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      apiUrl("/api/shop/order/create"),
      orderData,
    );

    return response.data;
  },
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      apiUrl(`/api/shop/order/list/${userId}`),
    );

    return response.data;
  },
);

// Fetch orders for guest users by guest ID and email
export const getGuestOrdersByIdAndEmail = createAsyncThunk(
  "/order/getGuestOrdersByIdAndEmail",
  async ({ guestId, email }) => {
    const response = await axios.get(
      apiUrl(`/api/shop/order/guest/${guestId}/${encodeURIComponent(email)}`),
    );

    return response.data;
  },
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      apiUrl(`/api/shop/order/details/${id}`),
    );

    return response.data;
  },
);

export const cancelOrderByUser = createAsyncThunk(
  "/order/cancelOrderByUser",
  async ({ orderId, userId, customerEmail }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        apiUrl(`/api/shop/order/cancel/${orderId}`),
        {
          userId,
          customerEmail,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to cancel order." });
    }
  },
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload?.data?._id || null;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getGuestOrdersByIdAndEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGuestOrdersByIdAndEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getGuestOrdersByIdAndEmail.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(cancelOrderByUser.pending, (state) => {
        state.isCancellingOrder = true;
      })
      .addCase(cancelOrderByUser.fulfilled, (state, action) => {
        state.isCancellingOrder = false;
        state.orderDetails = action.payload.data;
        state.orderList = state.orderList.map((order) =>
          order?._id === action.payload.data?._id ? action.payload.data : order
        );
      })
      .addCase(cancelOrderByUser.rejected, (state) => {
        state.isCancellingOrder = false;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
