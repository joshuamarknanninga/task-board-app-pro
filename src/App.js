// src/App.js

import React from 'react';
import Board from './components/Board';
import './styles/App.css'; // Ensure this path is correct

const App = () => {
  return (
    <div className="App">
      <h1>Task Board App Pro</h1>
      <Board />
    </div>
  );
};

export default App;
