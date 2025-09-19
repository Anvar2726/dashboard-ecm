import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ENDPOINT } from "../../consts";


export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
  }),
  endpoints: (builder) => ({
    getCategoryProducts: builder.query({
      query: ({categoryId, params}) => ({
        url: `/categories/${categoryId}/products`,
        params,
      }),
    }),
    addCategoryProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}/products`,
        method: "POST",
        body,
      }),
    }),
    editCategoryProduct: builder.mutation({
      query: ({ categoryId, productId, body }) => ({
        url: `categories/${categoryId}/products/${productId}`,
        method: "PUT",
        body,
      }),
    }),
    deleteCategoryProduct: builder.mutation({
      query: ({ categoryId, productId }) => ({
        url: `categories/${categoryId}/products/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetCategoryProductsQuery, useAddCategoryProductMutation, useEditCategoryProductMutation, useDeleteCategoryProductMutation } = categoryApi;