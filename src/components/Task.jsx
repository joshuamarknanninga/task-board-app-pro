// src/components/Task.jsx

import React, { useState, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { BoardContext } from '../context/BoardContext';
import './Task.css';

const Task = ({ task, index, columnId }) => {
  const { editTask, deleteTask } = useContext(BoardContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);

  const handleDelete = () => {
    deleteTask(columnId, task.id);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (editedTitle.trim() === '') return;

    editTask(columnId, task.id, {
      title: editedTitle,
      description: editedDesc,
    });
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <form onSubmit={handleEdit} className="edit-task-form">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
              ></textarea>
              <div className="edit-task-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
