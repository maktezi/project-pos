import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './main.css'
import Products from './pages/Products';
import PosPage from './pages/PosPage';
import Form from './components/Form';

const router = createBrowserRouter([
  { path: "/",
    element: <PosPage /> },
  { path: "/products",
    element: <Products /> },
    {
      path: '/add',
      element: <Form key="userCreate"/>
  },
  {
      path: '/edit/:id',
      element: <Form key="userEdit"/>
  },
  { path: "*",
    element: <PosPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
