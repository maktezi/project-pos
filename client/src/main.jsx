import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './main.css'
import Dashboard from './pages/Dashboard.jsx';
import PosPage from './pages/PosPage.jsx';
import MainLayout from './layout/MainLayout.jsx';

const router = createBrowserRouter([
  { path: "/",
    element: <MainLayout /> },
  { path: "/dashboard",
    element: <Dashboard /> },
  { path: "/pos page",
    element: <PosPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
