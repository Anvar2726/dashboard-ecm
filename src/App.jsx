import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import DashboardPage from "./pages/dashboard";
import ProductsPage from "./pages/products";
import CategoriesPage from "./pages/categories";
import CategoryPage from "./pages/category";
import LayoutPage from "./components/layout/index";
import NotFoundPage from "./pages/not-found";
import LoginPage from "./pages/login";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Agar foydalanuvchi auth bo'lmagan bo‘lsa, login page */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Authenticated foydalanuvchilar uchun routes */}
        {isAuthenticated ? (
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/:id" element={<CategoryPage />} />
          </Route>
        ) : (
          // 👇 Agar auth bo'lmasa, barcha route'lar login'ga redirect bo'ladi
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
