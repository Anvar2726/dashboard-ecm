import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINT } from "../../consts";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: ENDPOINT }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (params) => ({
        url: "categories",
        params,
      }),
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "categories",
        method: "POST",
        body: category,
      }),
    }),
    editCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: category,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
    }),
    deleteCategoryProducts: builder.mutation({
      query: (id) => ({
        url: `categories/${id}/products`,
        method: "DELETE",
      }),
    })
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCategoryProductsMutation,
} = categoriesApi;
