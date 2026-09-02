import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Configure backend API base URL for Render deployment
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
