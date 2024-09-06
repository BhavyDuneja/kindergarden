// ../components/Navbar.js
import React from 'react';
import './navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navigation-bar">
        <icon className="logo">
        <a href="/">育児支援</a>
        </icon>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/service">Profile</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/">Logout</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
