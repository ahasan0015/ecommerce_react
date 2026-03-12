import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Context & Route Guard
import { AuthProvider } from "./../src/components/contex/AtuhContex.tsx";
import ProtectedRoute from "./../src/components/contex/ProtectedRoute.tsx";

// import './index.css'
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import NotFound from "./components/Notfound.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";

//others page

import TshirtPage from "./components/pages/Tshirt.tsx";
import ShirtCollection from "./components/pages/Shirt.tsx";
import PantCollection from "./components/pages/Pant.tsx";
import StaticProfilePage from "./components/Profile.tsx";
import CartPage from "./components/Cart.tsx";
import ManageUsers from "./components/pages/users/ManageUsers.tsx";
import DetailsUser from "./components/pages/users/DetailsUser.tsx";
import ManageRoles from "./components/pages/roles/ManageRoles.tsx";
import EditUser from "./components/pages/users/EditUser.tsx";

//categories
import ManageCategories from "./components/pages/categories/ManageCategories.tsx";
import ManageOrders from "./components/pages/orders/ManageOrders.tsx";
import ManageProducts from "./components/pages/products/ManageProducts.tsx";
import Reports from "./components/pages/reports/Reports.tsx";
import Settings from "./components/pages/settings/Settings.tsx";
import ManageCoupons from "./components/pages/coupons/ManageCoupons.tsx";
import CreateUser from "./components/pages/users/CreateUser.tsx";
//brands
import ManageBrands from "./components/pages/brands/ManageBrands.tsx";
import CreateBrand from "./components/pages/brands/CreateBrands.tsx";
import EditBrand from "./components/pages/brands/EditBrand.tsx";
//categories
import CreateCategory from "./components/pages/categories/CreateCategory.tsx";
import EditCategory from "./components/pages/categories/EditCategories.tsx";
//products
import ProductCreate from "./components/pages/products/CreateProducts.tsx";
import ProductDetails from "./components/pages/products/DetailsProduct.tsx";
import EditProduct from "./components/pages/products/EditProducts.tsx";
//sizes
import ManageSize from "./components/pages/sizes/ManageSize.tsx";
//colors
import ManageColors from "./components/pages/colors/ManageColors.tsx";
//variant
import ProductVariants from "./components/pages/productVariants/ProductVariants.tsx";
import BulkVariantForm from "./components/forms/BulkVariantForm.tsx";

const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin", "manager"]} />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "/categories", element: <ManageCategories /> },
          { path: "/categories/create", element: <CreateCategory /> },
          { path: "/categories/edit/:id", element: <EditCategory /> },
          { path: "/orders", element: <ManageOrders /> },
          { path: "/products", element: <ManageProducts /> },
          { path: "/products/create", element: <ProductCreate /> },
          { path: "/products/:id", element: <ProductDetails /> },
          { path: "/products/edit/:id", element: <EditProduct /> },
        ],
      },
      // ২. শুধুমাত্র Admin এই রাউটগুলো দেখতে পারবে
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/users/:id", element: <DetailsUser /> },
          { path: "/users/create", element: <CreateUser /> },
          { path: "/users/edit/:id", element: <EditUser /> },
          { path: "reports", element: <Reports /> },
          { path: "settings", element: <Settings /> },
          { path: "/roles", element: <ManageRoles /> },
          { path: "/reports", element: <Reports /> },
          { path: "/settings", element: <Settings /> },
          { path: "/coupons", element: <ManageCoupons /> },
          { path: "/users", element: <ManageUsers /> },
          //brands
          { path: "/brands", element: <ManageBrands /> },
          { path: "/brands/create", element: <CreateBrand /> },
          { path: "/brands/edit/:id", element: <EditBrand /> },
          //sizes
          { path: "/sizes", element: <ManageSize /> },
          //colors
          { path: "/colors", element: <ManageColors /> },
        ],
      },

      { path: "/men/t-shirts", element: <TshirtPage /> },
      { path: "/men/shirts", element: <ShirtCollection /> },
      { path: "/men/pants", element: <PantCollection /> },
      { path: "/profile", element: <StaticProfilePage /> },
      { path: "/cart", element: <CartPage /> },

      //Product variants Form
      { path: "/variants/create", element: <BulkVariantForm /> },
      { path: "/variants/products/:id", element: <ProductVariants /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <RouterProvider router={AppRoute} />
//   </StrictMode>,
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* ১. AuthProvider দিয়ে পুরো অ্যাপকে র‍্যাপ করা হয়েছে */}
    <AuthProvider>
      {/* ২. RouterProvider-এ আমাদের নতুন কনফিগার করা রুটগুলো পাস করা হয়েছে */}
      <RouterProvider router={AppRoute} />
    </AuthProvider>
  </StrictMode>,
);
