import React from 'react'
import { useGetCategoriesQuery } from '../../redux/query/categories';
import { useGetProductsQuery } from '../../redux/query/products';
import { Link } from 'react-router';


import './style.scss'
const DashboardPage = () => {
  const {data: categories} = useGetCategoriesQuery();
  const {data: products} = useGetProductsQuery();
  return (
    <div className='dashboard-page'>
      <p>Welcome to the Dashboard!</p>

      <div>
        <h1>
          <Link to="/categories">Total categories: {categories?.length}</Link>
        </h1>
        <h1>
          <Link to="/products">Total products: {products?.length}</Link>
        </h1>

      </div>
    </div>
  );
}

export default DashboardPage