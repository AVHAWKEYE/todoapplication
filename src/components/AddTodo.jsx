import React, { useState } from 'react';

const PRIORITY_OPTIONS = [
  { value: 'low',    label: '🟢 Low',    color: '#10b981' },
  { value: 'medium', label: '🟡 Medium', color: '#f59e0b' },
  { value: 'high',   label: '🔴 High',   color: '#ef4444' },
];

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, priority, deadline });
    setText('');
    setPriority('medium');
    setDeadline('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
  };

  // Minimum date = today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section className="add-todo-section" aria-label="Add new task">
      <form className="add-todo-card" onSubmit={handleSubmit} noValidate>
        <div className="add-todo-row">
          <input
            id="todo-input"
            className="add-todo-input"
            type="text"
            placeholder="What needs to be done? ✨"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            aria-label="New task title"
            autoComplete="off"
            maxLength={200}
          />
          <button id="add-btn" type="submit" className="add-btn" disabled={!text.trim()}>
            <span className="add-btn-icon">+</span>
            Add Task
          </button>
        </div>
        <div className="add-todo-extras">
          <select
            id="priority-select"
            className="add-todo-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Task priority"
          >
            {PRIORITY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            id="deadline-input"
            className="add-todo-date"
            type="date"
            value={deadline}
            min={todayStr}
            onChange={(e) => setDeadline(e.target.value)}
            aria-label="Task deadline"
          />
        </div>
      </form>
    </section>
  );
}
