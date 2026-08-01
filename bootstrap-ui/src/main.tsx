import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { InterfaceList, InterfaceDetail, Home } from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode >,
)
