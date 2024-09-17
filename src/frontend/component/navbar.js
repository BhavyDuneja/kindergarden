// ../components/Navbar.js
import React from 'react';
import './navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navigation-bar">
        <ic className="logo">
        <a href="/">育児支援</a>
        </ic>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">ログイン</a></li>
        <li><a href="/register">登録</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
