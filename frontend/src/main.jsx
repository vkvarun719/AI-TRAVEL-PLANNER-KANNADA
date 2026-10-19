import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { fontFamily: 'Inter, sans-serif' },
        success: { style: { background: '#1A7A4A', color: '#fff' } },
        error: { style: { background: '#C8102E', color: '#fff' } },
      }}
    />
    <App />
  </React.StrictMode>
)
