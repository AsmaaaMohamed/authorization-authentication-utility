/**
 * File: src/main.jsx
 * Description: Client-side application entry point mounting React root with BrowserRouter routing and ToastContainer notifications.
 * 
 * Steps:
 * 1. Imports React StrictMode, ReactDOM createRoot, BrowserRouter, and ReactToastify styles.
 * 2. Mounts the root React DOM node into #root.
 * 3. Wraps the App component tree with BrowserRouter for client-side routing.
 * 4. Configures dark-themed ToastContainer for global user feedback notifications.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </BrowserRouter>
  </StrictMode>,
)
