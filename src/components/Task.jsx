// src/components/Task.jsx

import React, { useState, useContext } from 'react';
import { Draggable } from '@hello-pangea/dnd'; // Updated import
import { BoardContext } from '../context/BoardContext';
import './Task.css';

/**
 * Task Component
 * Represents a single task within a column.
 *
 * Props:
 * - task: An object containing the task's id, title, and description.
 * - index: The index of the task within the column's task list.
 * - columnId: The ID of the column to which the task belongs.
 */
const Task = ({ task, index, columnId }) => {
  const { editTask, deleteTask } = useContext(BoardContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion animation

  /**
   * Handles the deletion of a task with fade-out animation.
   */
  const handleDelete = () => {
    setIsDeleting(true); // Trigger fade-out
    // Delay actual deletion to allow animation to complete
    setTimeout(() => {
      deleteTask(columnId, task.id);
    }, 500); // Duration should match fade-out animation duration
  };

  /**
   * Handles the submission of the edit form.
   * @param {Event} e - The form submission event.
   */
  const handleEdit = (e) => {
    e.preventDefault();
    if (editedTitle.trim() === '') return;

    // Update the task in the context
    editTask(columnId, task.id, {
      title: editedTitle,
      description: editedDesc,
    });
    setIsEditing(false); // Exit edit mode
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task ${
            snapshot.isDragging ? 'dragging' : ''
          } ${isDeleting ? 'fade-out' : 'fade-in'}`} // Apply animations
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Optional: Add inline styles for better visualization during dragging
          style={{
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging
              ? '0 4px 12px rgba(0,0,0,0.2)'
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
