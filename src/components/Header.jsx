import React, { useState, useEffect } from 'react';

export default function Header({ theme, onToggleTheme, totalTasks, completedTasks }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo-icon" aria-hidden="true">✅</div>
          <div>
            <div className="header-title">TaskFlow</div>
            <div className="header-subtitle">
              {completedTasks}/{totalTasks} tasks · {percent}% done
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="datetime-display">
            <span className="datetime-time">{timeStr}</span>
            <span className="datetime-date">{dateStr}</span>
          </div>
          <button
            id="theme-toggle"
            className="theme-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="progress-wrap" style={{ marginTop: 12, borderRadius: 99 }}>
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>
      )}
    </header>
  );
}
