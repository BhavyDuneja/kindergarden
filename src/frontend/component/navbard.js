// ../components/Navbar.js
import React from 'react';
import './navbar.css'; 

const Navbard = () => {
  return (
    <nav className="navigation-bar">
        <icon className="logo">
        <a href="/">育児支援</a>
        </icon>
      <ul>
        <li><a href="/">ログアウト</a></li>
      </ul>
    </nav>
  );
}

export default Navbard;
