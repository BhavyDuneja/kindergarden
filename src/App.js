import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Page/Login.js';   
import HomePage from './Page/home.js'; 

function App() {
    return (
        <Router>
            <div>
                {/* Define your routes here */}
                <Routes>
                    {/* Set Login component as the default route */}
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/" element={<Login />} />
                    {/* Add a route for HomePage */}
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;