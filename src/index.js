import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<span>loading...</span>}>
    <App />
  </Suspense>,
)
