import React, { useState } from 'react';

const PRIORITY_ACCENT = {
  low:    '#10b981',
  medium: '#f59e0b',
  high:   '#ef4444',
};

function getDeadlineInfo(deadline) {
  if (!deadline) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due   = new Date(deadline + 'T00:00:00');
  const diff  = Math.round((due - today) / 86400000);

  if (diff < 0)  return { label: `⚠️ Overdue by ${Math.abs(diff)}d`, cls: 'overdue' };
  if (diff === 0) return { label: '🔥 Due today!', cls: 'due-soon' };
  if (diff <= 2)  return { label: `⏰ Due in ${diff}d`, cls: 'due-soon' };
  return {
    label: `📅 ${new Date(deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    cls: '',
  };
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    const t = editText.trim();
    if (!t) return;
    onEdit(todo.id, t);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setEditing(false); setEditText(todo.text); }
  };

  const deadlineInfo = getDeadlineInfo(todo.deadline);
  const accent = PRIORITY_ACCENT[todo.priority] || PRIORITY_ACCENT.medium;

  return (
    <article
      className={`todo-item${todo.completed ? ' completed' : ''}`}
      style={{ '--item-accent': accent }}
      aria-label={`Task: ${todo.text}`}
    >
      {/* Checkbox */}
      <button
        className={`todo-check${todo.completed ? ' checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={todo.completed}
      >
        {todo.completed && <span className="check-icon">✓</span>}
      </button>

      {/* Content */}
      <div className="todo-content">
        <div className="todo-text-wrap">
          {editing ? (
            <input
              className="todo-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
              aria-label="Edit task text"
            />
          ) : (
            <span className={`todo-text${todo.completed ? ' done' : ''}`}>
              {todo.text}
            </span>
          )}
          {!editing && (
            <span className={`priority-badge ${todo.priority}`}>
              {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}&nbsp;
              {todo.priority}
            </span>
          )}
        </div>

        <div className="todo-meta">
          {deadlineInfo && !todo.completed && (
            <span className={`todo-date ${deadlineInfo.cls}`}>{deadlineInfo.label}</span>
          )}
          <span className="created-at">
            Added {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        {editing ? (
          <>
            <button id={`save-${todo.id}`} className="action-btn save" onClick={handleSave} title="Save">💾</button>
            <button id={`cancel-${todo.id}`} className="action-btn cancel" onClick={() => { setEditing(false); setEditText(todo.text); }} title="Cancel">✕</button>
          </>
        ) : (
          <>
            {!todo.completed && (
              <button id={`edit-${todo.id}`} className="action-btn edit" onClick={() => setEditing(true)} title="Edit task">✏️</button>
            )}
            <button id={`delete-${todo.id}`} className="action-btn delete" onClick={() => onDelete(todo.id)} title="Delete task">🗑</button>
          </>
        )}
      </div>
    </article>
  );
}
