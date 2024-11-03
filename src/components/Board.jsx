// src/components/Board.jsx

import React, { useContext } from 'react';
import Column from './Column';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BoardContext } from '../context/BoardContext';
import './Board.css';

const Board = () => {
  const { columns, setColumns } = useContext(BoardContext);

  // Handler for drag end event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If the position hasn't changed, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(
      (column) => column.id === source.droppableId
    );
    const destColumn = columns.find(
      (column) => column.id === destination.droppableId
    );

    // Moving within the same column
    if (sourceColumn === destColumn) {
      const updatedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, movedTask);

      const updatedColumn = { ...sourceColumn, tasks: updatedTasks };

      setColumns(
        columns.map((column) =>
          column.id === updatedColumn.id ? updatedColumn : column
        )
      );
    } else {
      // Moving to a different column
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, movedTask);

      const updatedSourceColumn = { ...sourceColumn, tasks: sourceTasks };
      const updatedDestColumn = { ...destColumn, tasks: destTasks };

      setColumns(
        columns.map((column) => {
          if (column.id === updatedSourceColumn.id) return updatedSourceColumn;
          if (column.id === updatedDestColumn.id) return updatedDestColumn;
          return column;
        })
      );
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
