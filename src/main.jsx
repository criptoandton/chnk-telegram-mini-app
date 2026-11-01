import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyTheme, getStoredTheme, systemTheme } from './lib/theme'
import './styles.css'
import './styles-extra.css'

// Make sure the theme is applied before the first render.
applyTheme(getStoredTheme() || systemTheme())

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
