import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import routes from './routes';

async function loadSettings() {
  const settings = await import('./settings.json');

  axios.defaults.baseURL = settings.VITE_BASE_URL;
  const router = createBrowserRouter(routes);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

loadSettings().catch(() => {});
