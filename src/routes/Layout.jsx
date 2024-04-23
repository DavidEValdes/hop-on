import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar'; 
import '../App.css';

const Layout = () => {
  return (
    <div className="App">
      <SideBar />
      <div className="App-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;