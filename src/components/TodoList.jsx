import React from 'react';
import TodoItem from './TodoItem';

const EMPTY_STATES = {
  All:       { icon: '🎯', title: 'No tasks yet!',       subtitle: 'Add your first task above to get started.' },
  Active:    { icon: '🌟', title: 'Nothing active!',     subtitle: 'All tasks are done — you\'re crushing it!' },
  Completed: { icon: '🏆', title: 'Nothing completed',   subtitle: 'Check off some tasks to see them here.' },
};

export default function TodoList({ todos, filter, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    const { icon, title, subtitle } = EMPTY_STATES[filter] || EMPTY_STATES.All;
    return (
      <div className="todo-list-section">
        <div className="empty-state" role="status" aria-live="polite">
          <span className="empty-icon">{icon}</span>
          <h2 className="empty-title">{title}</h2>
          <p className="empty-subtitle">{subtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="todo-list-section" aria-label="Task list" aria-live="polite">
      <ol className="todo-list" style={{ listStyle: 'none' }}>
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
