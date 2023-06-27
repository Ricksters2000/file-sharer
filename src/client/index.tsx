import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '../pages/home/App'
import { bodyId } from '../elementIds'

ReactDOM.hydrateRoot(document.getElementById(bodyId) as HTMLElement,
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)