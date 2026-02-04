import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//tawliwind css


// import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './components/Dashboard.tsx'
import { Register } from './components/Register.tsx'
import NotFound from './components/Notfound.tsx'
import { Login } from './components/Login.tsx'
import TshirtPage from './components/pages/Tshirt.tsx';
import ShirtCollection from './components/pages/Shirt.tsx';
import PantCollection from './components/pages/Pant.tsx';
import StaticProfilePage from './components/Profile.tsx';
import CartPage from './components/Cart.tsx';
import ManageUsers from './components/pages/users/ManageUsers.tsx';
import ManageRoles from './components/pages/roles/ManageRoles.tsx';
import DetailsUser from './components/pages/users/DetailsUser.tsx';
import CreateUserForm from './components/pages/users/CreateUser.tsx';
import EditUser from './components/pages/users/EditUser.tsx';
//categories
import ManageCategories from './components/pages/categories/ManageCategories.tsx';
import ManageOrders from './components/pages/orders/ManageOrders.tsx';
import ManageProducts from './components/pages/products/ManageProducts.tsx';
import Reports from './components/pages/reports/Reports.tsx';
import Settings from './components/pages/settings/Settings.tsx';
import ManageCoupons from './components/pages/coupons/ManageCoupons.tsx';





const AppRoute = createBrowserRouter([
  {
    path: "/", element: <App />,
    children: [
      {path:'/dashboard', element:<Dashboard />},
      {path:'/men/t-shirts', element: <TshirtPage />},
      {path:'/men/shirts', element: <ShirtCollection />},
      {path:'/men/pants', element: <PantCollection />},
      {path:'/profile', element: <StaticProfilePage/>},
      {path:'/cart', element: <CartPage/>},
      {path:'/users', element: <ManageUsers/>},
      {path:'/users/details', element: <DetailsUser/>},
      {path:'/users/create', element: <CreateUserForm/>},
      {path:'/edit/user', element: <EditUser/>},
      {path:'/roles', element: <ManageRoles/>},
      {path:'/categories', element: <ManageCategories/>},
      {path:'/orders', element: <ManageOrders/>},
      {path:'/products', element: <ManageProducts/>},
      {path:'/reports', element: <Reports/>},
      {path:'/settings', element: <Settings/>},
      {path:'/coupons', element: <ManageCoupons/>},
      
      
    ]
  },
  {path:'/login', element:<Login />},
  {path:'/register', element:<Register />},
  {path:'*', element:<NotFound />},
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={AppRoute} />
  </StrictMode>,
)
