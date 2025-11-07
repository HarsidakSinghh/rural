import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContextFree';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/HeaderNew';
import Home from './pages/Home';
import SubmitNews from './pages/SubmitNews';
import NewsDetail from './pages/NewsDetailFree';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import LiveVideo from './pages/LiveVideo';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/submit" element={<SubmitNews />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/live" element={<LiveVideo />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Admin redirect - admins go directly to dashboard */}
                <Route path="/admin-home" element={<Navigate to="/admin" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
