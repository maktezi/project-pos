import React from 'react'
import NavBar from '../components/NavBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => {
    return (
    <>
        <NavBar />
        {children}
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    </>
    )
}

export default MainLayout