import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
export const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:5000" 
  : "https://aegis-ai-backend-mmo5.onrender.com";
