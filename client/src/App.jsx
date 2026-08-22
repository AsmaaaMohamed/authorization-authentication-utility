/**
 * File: src/App.jsx
 * Description: Root React component defining client-side navigation routes for Home, Login, and Reset Password pages.
 * 
 * Steps:
 * 1. Imports React, React Router components (Routes, Route, Link), and page views.
 * 2. Defines Home landing view showcasing project navigation links.
 * 3. Defines Login view placeholder with link to Reset Password flow.
 * 4. Configures React Router Routes mapping path / to Home, /reset-password to ResetPassword, and /login to Login.
 * 5. Exports App component.
 */

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
      <div className="text-center max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-3">Auth & Authorization Utility</h1>
        <p className="text-slate-400 text-sm mb-6">
          Authentication, Role-Based Access Control, Cloudinary Uploads & Password Reset System.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/reset-password"
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all"
          >
            Reset Password
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700"
          >
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
      <div className="text-center max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-3">Login</h1>
        <p className="text-slate-400 text-sm mb-6">Login component placeholder</p>
        <Link
          to="/reset-password"
          className="text-indigo-400 hover:text-indigo-300 text-sm underline"
        >
          Forgot password? Reset here
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;