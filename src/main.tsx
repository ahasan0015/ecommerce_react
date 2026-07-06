import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Context & Route Guard
import { AuthProvider } from "./../src/components/contex/AtuhContex.tsx";
import ProtectedRoute from "./../src/components/contex/ProtectedRoute.tsx";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// Loading component
export const PageLoader = () => <div className="p-5 text-center">Loading...</div>;

// --- Lazy Loading Pages ---
const Dashboard = lazy(() => import("./components/Dashboard.tsx"));
const NotFound = lazy(() => import("./components/Notfound.tsx"));
const Login = lazy(() => import("./components/Login.tsx"));
const StaticProfilePage = lazy(() => import("./components/Profile.tsx"));

// Users
const ManageUsers = lazy(
  () => import("./components/pages/users/ManageUsers.tsx"),
);
const DetailsUser = lazy(
  () => import("./components/pages/users/DetailsUser.tsx"),
);
const EditUser = lazy(() => import("./components/pages/users/EditUser.tsx"));
const CreateUser = lazy(
  () => import("./components/pages/users/CreateUser.tsx"),
);
const ManageRoles = lazy(
  () => import("./components/pages/roles/ManageRoles.tsx"),
);

// Products & Categories
const ManageCategories = lazy(
  () => import("./components/pages/categories/ManageCategories.tsx"),
);
const CreateCategory = lazy(
  () => import("./components/pages/categories/CreateCategory.tsx"),
);
const EditCategory = lazy(
  () => import("./components/pages/categories/EditCategories.tsx"),
);
const ManageProducts = lazy(
  () => import("./components/pages/products/ManageProducts.tsx"),
);
const CreateProductStatic = lazy(
  () => import("./components/pages/products/CreateProducts.tsx"),
);
const ProductDetails = lazy(
  () => import("./components/pages/products/DetailsProduct.tsx"),
);
const EditProduct = lazy(
  () => import("./components/pages/products/EditProducts.tsx"),
);
const TrashProducts = lazy(
  () => import("./components/pages/products/TrashProducts.tsx"),
);

// Orders, Brands, etc.
const ManageOrders = lazy(
  () => import("./components/pages/orders/ManageOrders.tsx"),
);
const DetailsOrder = lazy(
  () => import("./components/pages/orders/DetailOrders.tsx"),
);
const ManageBrands = lazy(
  () => import("./components/pages/brands/ManageBrands.tsx"),
);
const CreateBrand = lazy(
  () => import("./components/pages/brands/CreateBrands.tsx"),
);
const EditBrand = lazy(() => import("./components/pages/brands/EditBrand.tsx"));
const Reports = lazy(() => import("./components/pages/reports/Reports.tsx"));
const Settings = lazy(() => import("./components/pages/settings/Settings.tsx"));
const ManageCoupons = lazy(
  () => import("./components/pages/coupons/ManageCoupons.tsx"),
);
const ManageSize = lazy(
  () => import("./components/pages/sizes/ManageSize.tsx"),
);
const ManageColors = lazy(
  () => import("./components/pages/colors/ManageColors.tsx"),
);
const ProductVariants = lazy(
  () => import("./components/pages/productVariants/ProductVariants.tsx"),
);

const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        element: <ProtectedRoute allowedRoles={["admin", "manager"]} />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "/categories", element: <ManageCategories /> },
          { path: "/categories/create", element: <CreateCategory /> },
          { path: "/categories/edit/:id", element: <EditCategory /> },
          { path: "/products", element: <ManageProducts /> },
          { path: "/products/trash", element: <TrashProducts /> },
          { path: "/orders", element: <ManageOrders /> },
          { path: "/admin/orders/:id", element: <DetailsOrder /> },
          { path: "/products/create", element: <CreateProductStatic /> },
          { path: "/products/:id", element: <ProductDetails /> },
          { path: "/products/edit/:id", element: <EditProduct /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/users/:id", element: <DetailsUser /> },
          { path: "/users/create", element: <CreateUser /> },
          { path: "/users/edit/:id", element: <EditUser /> },
          { path: "/users", element: <ManageUsers /> },
          { path: "/roles", element: <ManageRoles /> },
          { path: "/reports", element: <Reports /> },
          { path: "/settings", element: <Settings /> },
          { path: "/coupons", element: <ManageCoupons /> },
          { path: "/brands", element: <ManageBrands /> },
          { path: "/brands/create", element: <CreateBrand /> },
          { path: "/brands/edit/:id", element: <EditBrand /> },
          { path: "/variants/products/:id", element: <ProductVariants /> },
          { path: "/sizes", element: <ManageSize /> },
          { path: "/colors", element: <ManageColors /> },
        ],
      },
      { path: "/profile", element: <StaticProfilePage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={AppRoute} />
  </AuthProvider>,
);
