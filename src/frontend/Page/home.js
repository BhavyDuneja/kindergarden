import React from 'react';
import Navbar from '../component/navbar.js';
import '../Styling/home.css';
const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <section className="banner">
        <h1>Welcome to 育児支援 CO.</h1>
      </section>
      <section className="content">
      </section>
      <footer className="footer">
      </footer>
    </div>
  );
}

export default HomePage;