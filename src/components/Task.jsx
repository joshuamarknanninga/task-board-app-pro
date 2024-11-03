// src/components/Task.jsx

import React, { useState, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd'; // Ensure this matches the installed library
import { BoardContext } from '../context/BoardContext';
import './Task.css';

const Task = ({ task, index, columnId }) => {
  const { editTask, deleteTask } = useContext(BoardContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);

  /**
   * Handles the deletion of a task.
   */
  const handleDelete = () => {
    deleteTask(columnId, task.id);
  };

  /**
   * Handles the submission of the edit form.
   * @param {Event} e - The form submission event.
   */
  const handleEdit = (e) => {
    e.preventDefault();
    if (editedTitle.trim() === '') return; // Prevent empty titles

    // Update the task in the context
    editTask(columnId, task.id, {
      title: editedTitle,
      description: editedDesc,
    });
    setIsEditing(false); // Exit edit mode
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Optional: Add inline styles for better visualization during dragging
          style={{
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging
              ? '0 2px 8px rgba(0,0,0,0.2)'
              : 'none',
          }}
        >
          {isEditing ? (
            /**
             * Edit Mode: Displays a form to edit the task's title and description.
             */
            <form onSubmit={handleEdit} className="edit-task-form">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
                placeholder="Task Title"
              />
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                placeholder="Task Description"
              ></textarea>
              <div className="edit-task-buttons">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /**
             * Display Mode: Shows the task's title and description with Edit and Delete options.
             */
            <>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <div className="task-actions">
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
