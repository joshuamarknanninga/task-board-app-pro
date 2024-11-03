// src/components/Column.jsx
import React, { useState, useContext } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';
import { BoardContext } from '../context/BoardContext';
import './Column.css';

const Column = ({ column }) => {
  const { addTask } = useContext(BoardContext);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskTitle.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDesc,
    };

    addTask(column.id, newTask);
    setTaskTitle('');
    setTaskDesc('');
  };

  return (
    <div className="column">
      <h2>{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} columnId={column.id} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
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
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default Column;
