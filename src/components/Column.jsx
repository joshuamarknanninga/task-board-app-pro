// src/components/Column.jsx

import React, { useState, useContext } from 'react';
import Task from './Task';
import { Droppable } from '@hello-pangea/dnd'; // Removed Draggable from import
import { BoardContext } from '../context/BoardContext';
import './Column.css';

/**
 * Column Component
 * Represents a single column in the task board (e.g., To Do, In Progress, Done).
 *
 * Props:
 * - column: An object containing the column's id, title, and tasks.
 */
const Column = ({ column }) => {
  const { addTask } = useContext(BoardContext);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  /**
   * Handles the addition of a new task to the column.
   * @param {Event} e - The form submission event.
   */
  const handleAddTask = (e) => {
    e.preventDefault();

    // Prevent adding a task with an empty title
    if (taskTitle.trim() === '') return;

    // Create a new task object with a unique string ID
    const newTask = {
      id: `task-${Date.now().toString()}`, // Prefixing for clarity
      title: taskTitle,
      description: taskDesc,
    };

    // Add the new task to the column via context
    addTask(column.id, newTask);

    // Reset input fields
    setTaskTitle('');
    setTaskDesc('');
  };

  /**
   * Debugging: Logs the column ID to ensure it's a string and correctly passed.
   */
  console.log(`Rendering Column: ${column.id}`);

  return (
    <div className="column">
      <h2>{column.title}</h2>

      {/* Droppable Area for Tasks */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`task-list ${
              snapshot.isDraggingOver ? 'dragging-over' : ''
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Render each task within the Droppable */}
            {column.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
              />
            ))}

            {/* Placeholder to maintain space during dragging */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Form to Add New Task */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        ></textarea>
        <button type="submit" className="add-task-button">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default Column;
