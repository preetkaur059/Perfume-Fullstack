import React from 'react'
import Home from './components/Home/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import { StoreProvider } from './context/StoreContext'
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Cart from './components/Cart/Cart'
import Wishlist from './components/Wishlist/Wishlist'
import Checkout from './components/Checkout/Checkout'
import Payment from './components/Payment/Payment'
import OrderSuccess2 from './components/OrderSuccess/OrderSuccess2'
import Orders from './components/Orders/Orders'
import Allproducts from './components/Allproducts/Allproducts'
import Men from './components/Categories/Men'
import Women from './components/Categories/Women'
import Unisex from './components/Categories/Unisex'
import Contact from './components/Contact/Contact'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from './components/ProductDetails/ProductDetails'
import Login from './components/auth/Login'
import Signup from './components/auth/SignUp'
import ForgotPassword from './components/auth/ForgotPassword'
import Profile from './components/profile/profile'

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
            path: '/',
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
            element: <ForgotPassword/>,
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
    }
  ])
  return (
    <StoreProvider>
      <RouterProvider router={router} />

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
