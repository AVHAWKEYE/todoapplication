import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './Header';
import AddTodo from './AddTodo';
import FilterBar from './FilterBar';
import TodoList from './TodoList';

const STORAGE_KEY = 'taskflow-todos';
const THEME_KEY   = 'taskflow-theme';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sortTodos(todos, sort) {
  const arr = [...todos];
  switch (sort) {
    case 'oldest':
      return arr.sort((a, b) => a.createdAt - b.createdAt);
    case 'priority':
      return arr.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1));
    case 'deadline':
      return arr.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
    case 'az':
      return arr.sort((a, b) => a.text.localeCompare(b.text));
    case 'newest':
    default:
      return arr.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export default function TodoApp() {
  // ── State ──────────────────────────────────────
  const [todos, setTodos]   = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [theme, setTheme]   = useState(() =>
    localStorage.getItem(THEME_KEY) || 'dark'
  );
  const [filter, setFilter] = useState('All');
  const [sort,   setSort]   = useState('newest');

  // ── Persist ────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Actions ────────────────────────────────────
  const handleAdd = useCallback(({ text, priority, deadline }) => {
    setTodos((prev) => [...prev, {
      id:        generateId(),
      text,
      priority,
      deadline,
      completed: false,
      createdAt: Date.now(),
    }]);
  }, []);

  const handleToggle = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleEdit = useCallback((id, newText) => {
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, text: newText } : t)
    );
  }, []);

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  // ── Derived ────────────────────────────────────
  const counts = useMemo(() => ({
    All:       todos.length,
    Active:    todos.filter((t) => !t.completed).length,
    Completed: todos.filter((t) =>  t.completed).length,
  }), [todos]);

  const filteredSorted = useMemo(() => {
    let list = todos;
    if (filter === 'Active')    list = list.filter((t) => !t.completed);
    if (filter === 'Completed') list = list.filter((t) =>  t.completed);
    return sortTodos(list, sort);
  }, [todos, filter, sort]);

  return (
    <div className="app-wrapper">
      <main className="container" role="main">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
          totalTasks={todos.length}
          completedTasks={counts.Completed}
        />

        <AddTodo onAdd={handleAdd} />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          counts={counts}
          onClearCompleted={handleClearCompleted}
        />

        <TodoList
          todos={filteredSorted}
          filter={filter}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <footer className="footer">
          Built with ❤️ · <span>TaskFlow</span> · &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
