import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ENDPOINT } from "../../consts";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "products",
        params,
      }),
    }),
    getProductsWithoutPagination: builder.query({
        query: (search) => ({
            url: "products",
            params: {search},
        })
    }),
    addProduct: builder.mutation({
      query: ({ categoryId, ...body }) => ({
        url: `categories/${categoryId}/products`,
        method: "POST",
        body,
      }),
    }),
    editProduct: builder.mutation({
        query: ({categoryId,id, values}) =>({
            url: `categories/${categoryId}/products/${id}`,
            method: "PUT",
            body: values,
        })
    }),
    deleteProduct: builder.mutation({
      query: ({id, categoryId}) => ({
        url: `categories/${categoryId}/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetProductsQuery, useDeleteProductMutation, useAddProductMutation, useEditProductMutation,
    useGetProductsWithoutPaginationQuery
 } = productsApi;
