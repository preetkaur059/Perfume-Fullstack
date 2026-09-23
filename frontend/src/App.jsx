import { lazy, Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from './components/Loading'

// Pages are loaded only when their route is visited, keeping the initial shop
// bundle smaller without changing any existing route URLs.
const Layout = lazy(() => import('./components/Layout/Layout'));
const Home = lazy(() => import('./components/Home/Home'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const Wishlist = lazy(() => import('./components/Wishlist/Wishlist'));
const Checkout = lazy(() => import('./components/Checkout/Checkout'));
const Payment = lazy(() => import('./components/Payment/Payment'));
const OrderSuccess2 = lazy(() => import('./components/OrderSuccess/OrderSuccess2'));
const Orders = lazy(() => import('./components/Orders/Orders'));
const Allproducts = lazy(() => import('./components/Allproducts/Allproducts'));
const Men = lazy(() => import('./components/Categories/Men'));
const Women = lazy(() => import('./components/Categories/Women'));
const Unisex = lazy(() => import('./components/Categories/Unisex'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const ProductDetails = lazy(() => import('./components/ProductDetails/ProductDetails'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/SignUp'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const Profile = lazy(() => import('./components/profile/profile'));
const AdminProtectedRoute = lazy(() => import('./components/admin/AdminProtectedRoute/AdminProtectedRoute'));
const AdminDashboard = lazy(() => import('./components/admin/AdminProtectedRoute/AdminDashboard/AdminDashboard'));
const Dashboard = lazy(() => import('./components/admin/AdminProtectedRoute/AdminDashboard/Dashboard'));
const Products = lazy(() => import('./components/admin/AdminProtectedRoute/AdminDashboard/Products'));
const Settings = lazy(() => import('./components/admin/AdminProtectedRoute/AdminDashboard/Settings'));
const AdminOrders = lazy(() => import('./components/admin/AdminProtectedRoute/AdminDashboard/AdminOrders'));
const Users = lazy(() => import('./components/admin/AdminProtectedRoute/AdminDashboard/Users'));


const App = () => {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children:
        [
          {
            index: true,
            element: <Home />,
          },
          {
            path: '/cart',
            element: <Cart />,
          },
          {
            path: '/wishlist',
            element: <Wishlist />,
          },
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/signup',
            element: <Signup />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: '/checkout',
            element: <Checkout />,
          },
          {
            path: '/payment',
            element: <Payment />,
          },
          {
            path: '/OrderSuccess2',
            element: <OrderSuccess2 />,
          },
          {
            path: '/Orders',
            element: <Orders />,
          },
          {
            path: '/Allproducts',
            element: <Allproducts />,
          },
          {
            path: '/Men',
            element: <Men />,
          },
          {
            path: '/Women',
            element: <Women />,
          },
          {
            path: '/Unisex',
            element: <Unisex />,
          },
          {
            path: '/Contact',
            element: <Contact />,
          },
          {
            path: '/product/:id',
            element: <ProductDetails />,
          }
        ]
    },
    {
      path: '/admin',
      element: <AdminProtectedRoute />,
      children: [
        {
          element: <AdminDashboard />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: "products",
              element: <Products />,
            },
            {
              path: "AdminOrders",
              element: <AdminOrders />,
            },
            {
              path: "users",
              element: <Users />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
          ],
        },
      ],
    },
  ])
  return (
    <StoreProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </StoreProvider>
  )
}

export default App
