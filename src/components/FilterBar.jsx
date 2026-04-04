import React from 'react';

const FILTERS = ['All', 'Active', 'Completed'];

const SORT_OPTIONS = [
  { value: 'newest',   label: '🕐 Newest first' },
  { value: 'oldest',   label: '🕐 Oldest first' },
  { value: 'priority', label: '🔥 By priority'  },
  { value: 'deadline', label: '📅 By deadline'  },
  { value: 'az',       label: '🔤 A → Z'        },
];

export default function FilterBar({ filter, onFilterChange, sort, onSortChange, counts, onClearCompleted }) {
  return (
    <div className="filter-section" role="toolbar" aria-label="Filter and sort tasks">
      <div className="filter-tabs" role="group" aria-label="Filter tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
            aria-pressed={filter === f}
          >
            {f}
            <span className="tab-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      <select
        id="sort-select"
        className="sort-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort tasks"
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {counts.Completed > 0 && (
        <button
          id="clear-completed-btn"
          className="clear-btn"
          onClick={onClearCompleted}
          aria-label="Clear all completed tasks"
        >
          🗑 Clear done
        </button>
      )}
    </div>
  );
}
