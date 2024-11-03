// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BoardProvider } from './context/BoardContext';
import './styles/App.css'; // Optional: If you want to apply global styles here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </React.StrictMode>
);
