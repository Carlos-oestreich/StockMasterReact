import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FlashProvider } from './context/FlashContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <FlashProvider>
                    <App />
                </FlashProvider>
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>,
)