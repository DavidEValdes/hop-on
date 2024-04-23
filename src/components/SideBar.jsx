import React from 'react';
import { Link } from 'react-router-dom';
import gamepadImage from '../assets/gamepad.png';

const SideBar = () => {
  return (
    <div className="App-sidebar">
      <div className="Header">
      <img src={gamepadImage} alt="Gamepad" className="Logo" /> 
        <h3 className="Header-title"> Hop On... </h3>
      </div>
      <div className="Menu">
        <ul>
          <ul className="Menu-item">
            <Link to="/" className="menu-link">
              <div>🏠    Home</div>
            </Link>
          </ul>
          <ul className="Menu-item">
            <Link to="/" className="menu-link">
              <div>🕹️ Games</div>
            </Link>
          </ul>
          <ul className="Menu-item">
            <Link to="/" className="menu-link">
              <div>ℹ️ About</div>
            </Link>
          </ul>
         
        </ul>
      </div>
    </div>
  );
};

export default SideBar;