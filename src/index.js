// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BoardProvider } from './context/BoardContext';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BoardProvider>
        <App />
      </BoardProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
