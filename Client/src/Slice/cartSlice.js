import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"


const getCartKey = (userId) => `cart_${userId}`;
const getTotalKey = (userId) => `total_${userId}`;
const getTotalItemsKey = (userId) => `totalItems_${userId}`;

const getInitialCartState = () => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = user?._id || "guest";
  return {
    cart: localStorage.getItem(getCartKey(userId))
      ? JSON.parse(localStorage.getItem(getCartKey(userId)))
      : [],
    total: localStorage.getItem(getTotalKey(userId))
      ? JSON.parse(localStorage.getItem(getTotalKey(userId)))
      : 0,
    totalItems: localStorage.getItem(getTotalItemsKey(userId))
      ? JSON.parse(localStorage.getItem(getTotalItemsKey(userId)))
      : 0,
  };
};

const initialState = getInitialCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { course, userId } = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);
      if (index >= 0) {
        toast.error("Course already in cart");
        return;
      }
      state.cart.push(course);
      state.totalItems++;
      state.total += course.price;
      localStorage.setItem(getCartKey(userId), JSON.stringify(state.cart));
      localStorage.setItem(getTotalKey(userId), JSON.stringify(state.total));
      localStorage.setItem(getTotalItemsKey(userId), JSON.stringify(state.totalItems));
      toast.success("Course added to cart");
    },
    removeFromCart: (state, action) => {
      const { courseId, userId } = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);
      if (index >= 0) {
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1);
        localStorage.setItem(getCartKey(userId), JSON.stringify(state.cart));
        localStorage.setItem(getTotalKey(userId), JSON.stringify(state.total));
        localStorage.setItem(getTotalItemsKey(userId), JSON.stringify(state.totalItems));
        toast.success("Course removed from cart");
      }
    },
    resetCart: (state, action) => {
      const userId = action?.payload?.userId || "guest";
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      localStorage.removeItem(getCartKey(userId));
      localStorage.removeItem(getTotalKey(userId));
      localStorage.removeItem(getTotalItemsKey(userId));
    },
    restoreCartFromStorage: (state, action) => {
      const userId = action?.payload?.userId || "guest";
      const cart = localStorage.getItem(getCartKey(userId))
        ? JSON.parse(localStorage.getItem(getCartKey(userId)))
        : [];
      const total = localStorage.getItem(getTotalKey(userId))
        ? JSON.parse(localStorage.getItem(getTotalKey(userId)))
        : 0;
      const totalItems = localStorage.getItem(getTotalItemsKey(userId))
        ? JSON.parse(localStorage.getItem(getTotalItemsKey(userId)))
        : 0;
      state.cart = cart;
      state.total = total;
      state.totalItems = totalItems;
    },
  },
})

export const { addToCart, removeFromCart, resetCart, restoreCartFromStorage } = cartSlice.actions

export default cartSlice.reducer
