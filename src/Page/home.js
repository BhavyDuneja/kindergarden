// HomePage.js
import React from 'react';
import Navbar from '../component/navbar.js';
import '../Styling/home.css'; // Assuming you have a CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />

      <section className="banner">
        <h1>Welcome to 育児支援 CO.</h1>
        {/* Add your banner image or carousel here */}
      </section>

      <section className="content">
        {/* Additional content sections can be added here */}
      </section>

      <footer className="footer">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default HomePage;
