// src/components/Board.jsx

import React, { useContext } from 'react';
import Column from './Column';
import { DragDropContext } from '@hello-pangea/dnd'; // Updated import
import { BoardContext } from '../context/BoardContext';
import '../styles/Board.css'; // Updated import

/**
 * Board Component
 * Represents the entire task board containing multiple columns.
 * Handles the drag-and-drop context and logic.
 */
const Board = () => {
  const { columns, setColumns } = useContext(BoardContext);

  /**
   * Handler for the end of a drag event.
   * Manages reordering within the same column or moving between different columns.
   *
   * @param {Object} result - The result object from the drag event.
   * @param {Object} result.source - The source droppable and index.
   * @param {Object} result.destination - The destination droppable and index.
   */
  const onDragEnd = (result) => {
    const { source, destination } = result; // Removed draggableId to fix ESLint warning

    // Debug: Log the drag result
    console.log('Drag End Result:', result);

    // If no destination (e.g., dropped outside any droppable), do nothing
    if (!destination) return;

    // If the item is dropped back to its original position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination columns based on droppableId
    const sourceColumn = columns.find(
      (column) => column.id === source.droppableId
    );
    const destColumn = columns.find(
      (column) => column.id === destination.droppableId
    );

    // Debug: Ensure columns are found
    console.log('Source Column:', sourceColumn);
    console.log('Destination Column:', destColumn);

    // If either source or destination column is not found, log an error and exit
    if (!sourceColumn || !destColumn) {
      console.error('Source or Destination column not found.');
      return;
    }

    // Moving within the same column
    if (sourceColumn.id === destColumn.id) {
      // Create a new array of tasks
      const updatedTasks = Array.from(sourceColumn.tasks);
      // Remove the dragged task from its original position
      const [movedTask] = updatedTasks.splice(source.index, 1);
      // Insert the dragged task at the new position
      updatedTasks.splice(destination.index, 0, movedTask);

      // Create a new column object with updated tasks
      const updatedColumn = {
        ...sourceColumn,
        tasks: updatedTasks,
      };

      // Update the columns state with the reordered tasks
      const newColumns = columns.map((column) =>
        column.id === updatedColumn.id ? updatedColumn : column
      );

      // Debug: Log the updated columns
      console.log('Updated Columns (Same Column):', newColumns);

      setColumns(newColumns);
    } else {
      // Moving to a different column

      // Clone the source and destination tasks arrays
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);

      // Remove the dragged task from the source column
      const [movedTask] = sourceTasks.splice(source.index, 1);
      // Add the dragged task to the destination column
      destTasks.splice(destination.index, 0, movedTask);

      // Create new column objects with updated tasks
      const updatedSourceColumn = {
        ...sourceColumn,
        tasks: sourceTasks,
      };
      const updatedDestColumn = {
        ...destColumn,
        tasks: destTasks,
      };

      // Update the columns state with the moved task
      const newColumns = columns.map((column) => {
        if (column.id === updatedSourceColumn.id) return updatedSourceColumn;
        if (column.id === updatedDestColumn.id) return updatedDestColumn;
        return column;
      });

      // Debug: Log the updated columns
      console.log('Updated Columns (Different Columns):', newColumns);

      setColumns(newColumns);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
