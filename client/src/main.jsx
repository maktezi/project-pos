import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './main.css'
import Products from './pages/Products';
import PosPage from './pages/PosPage';
import MainLayout from './layout/MainLayout';

const router = createBrowserRouter([
  { path: "/",
    element: <MainLayout /> },
  { path: "/products",
    element: <Products /> },
  { path: "/pos",
    element: <PosPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
