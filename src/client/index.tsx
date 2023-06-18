import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { App } from '../App.tsx'
import { bodyId } from '../elementIds.ts'

ReactDOM.hydrateRoot(document.getElementById(bodyId) as HTMLElement,
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)

