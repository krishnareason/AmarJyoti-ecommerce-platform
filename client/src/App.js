import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Page Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage'; // <-- ADDED
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

// Import Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Import Protective Route
import AdminRoute from './components/auth/AdminRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Routes for Logged-in Users */}
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} /> {/* <-- ADDED */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            
            {/* Admin-Only Route */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;