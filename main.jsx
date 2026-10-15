import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AIWorkspace from './AIWorkspace.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {import.meta.env.MODE === 'ai-workspace' ? <AIWorkspace /> : <App />}
    </AuthProvider>
  </StrictMode>,
)
