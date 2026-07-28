import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { Author } from './author'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')

createRoot(root).render(
  <StrictMode>
    <Author />
  </StrictMode>,
)
