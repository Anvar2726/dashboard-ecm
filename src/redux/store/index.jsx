import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { categoriesApi } from "../query/categories";
import { productsApi } from "../query/products";
import { categoryApi } from "../query/category";
import { authSlice } from "../slice/auth";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(categoriesApi.middleware, productsApi.middleware, categoryApi.middleware),
});

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
