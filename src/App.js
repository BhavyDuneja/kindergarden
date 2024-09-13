import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './frontend/Page/login.js';   
import HomePage from './frontend/Page/home.js'; 
import RegisterScreen from './frontend/Page/register.js';
import AdminScreen from './frontend/Page/admin.js';
import ParentDashboard from './frontend/Page/parent.js';

function App() {
    return (
        <Router>
            <div>
                {/* Define your routes here */}
                <Routes>
                    {/* Set Login component as the default route */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterScreen/>}/> 
                    <Route path='/admin-dashboard' element = {<AdminScreen/>}/>
                    <Route path="/parent-dashboard/:parentID" element={<ParentDashboard />} />
                    {/* Add a route for HomePage */}
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;