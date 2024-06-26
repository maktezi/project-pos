// import React from 'react'
import NavBar from '../components/NavBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mobileerror from '../assets/mobile-error.gif';
import './layout.css'

const MainLayout = ({ children }) => {
    return (
    <>
        <NavBar />
        <div id='desktop'>
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
        </div>
        <div id='mobile'>
            <img className='image-notif' src={mobileerror}/>
            <h2>
            There is no mobile UI <br/>available at the moment.
            </h2>
        </div>
    </>
    )
}

export default MainLayout