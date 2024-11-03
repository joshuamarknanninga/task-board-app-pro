// src/context/BoardContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

// Create the context
export const BoardContext = createContext();

// Create the provider component
export const BoardProvider = ({ children }) => {
  const [columns, setColumns] = useState(() => {
    // Retrieve columns from localStorage if available
    const savedColumns = localStorage.getItem('columns');
    return savedColumns
      ? JSON.parse(savedColumns)
      : [
          { id: 'column-1', title: 'To Do', tasks: [] },
          { id: 'column-2', title: 'In Progress', tasks: [] },
          { id: 'column-3', title: 'Done', tasks: [] },
        ];
  });

  // Persist columns to localStorage whenever they change
  useEffect(() => {
    console.log('Saving columns to localStorage:', columns); // Debug log
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  // Function to add a task
  const addTask = (columnId, task) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, task] }
          : column
      )
    );
  };

  // Function to edit a task
  const editTask = (columnId, taskId, updatedTask) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
              ),
            }
          : column
      )
    );
  };

  // Function to delete a task
  const deleteTask = (columnId, taskId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          : column
      )
    );
  };

  return (
    <BoardContext.Provider
      value={{ columns, setColumns, addTask, editTask, deleteTask }}
    >
      {children}
    </BoardContext.Provider>
  );
};
