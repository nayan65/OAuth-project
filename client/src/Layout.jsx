import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';


const Layout = () => {
  return (
    <>
      <Navbar/> {/* Navbar will appear on all pages */}
    
        <Outlet />  {/* This will render the specific page content based on the route */}
    </>
      
    
  );
};

export default Layout;
