import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, filter, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filter !== 'all') params.append('filter', filter);
      if (sortBy) params.append('sort', sortBy);
      
      const res = await axios.get(`/api/tasks?${params}`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    
    try {
      setError('');
      await axios.post('/api/tasks', { title: title.trim(), priority });
      setTitle('');
      setPriority('medium');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      setError('');
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    try {
      setError('');
      const task = tasks.find(t => t._id === id);
      await axios.patch(`/api/tasks/${id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const updateTaskPriority = async (id, newPriority) => {
    try {
      setError('');
      await axios.patch(`/api/tasks/${id}`, { priority: newPriority });
      fetchTasks();
    } catch (err) {
      setError('Failed to update priority');
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    
    try {
      setError('');
      await axios.put(`/api/tasks/${editingTask}`, { 
        title: editTitle.trim(), 
        priority: editPriority 
      });
      setEditingTask(null);
      setEditTitle('');
      setEditPriority('medium');
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditPriority('medium');
  };

  const toggleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAllTasks = () => {
    setSelectedTasks(tasks.map(task => task._id));
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const bulkAction = async (action) => {
    if (selectedTasks.length === 0) return;
    
    try {
      setError('');
      await axios.post('/api/tasks/bulk', { action, taskIds: selectedTasks });
      setSelectedTasks([]);
      fetchTasks();
    } catch (err) {
      setError(`Failed to ${action} tasks`);
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#57606f';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 Task Tracker Pro</h1>
          <div className="stats">
            <span className="stat">
              <strong>{completedCount}</strong> of <strong>{totalCount}</strong> completed
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <div className="controls">
          <div className="add-task-section">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="task-input"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <button onClick={addTask} className="add-btn" disabled={!title.trim()}>
              Add Task
            </button>
          </div>

          <div className="filter-section">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="search-input"
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {selectedTasks.length > 0 && (
            <div className="bulk-actions">
              <span className="selection-info">
                {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
              </span>
              <button onClick={() => bulkAction('complete')} className="bulk-btn complete">
                Mark Complete
              </button>
              <button onClick={() => bulkAction('uncomplete')} className="bulk-btn uncomplete">
                Mark Incomplete
              </button>
              <button onClick={() => bulkAction('delete')} className="bulk-btn delete">
                Delete Selected
              </button>
              <button onClick={clearSelection} className="bulk-btn clear">
                Clear Selection
              </button>
            </div>
          )}
        </div>

        <div className="task-list">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Add one above to get started!</p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                    onChange={selectedTasks.length === tasks.length ? clearSelection : selectAllTasks}
                  />
                  Select All
                </label>
              </div>
              {tasks.map(task => (
                <div 
                  key={task._id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${selectedTasks.includes(task._id) ? 'selected' : ''}`}
                >
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task._id)}
                      onChange={() => toggleSelectTask(task._id)}
                    />
                  </div>
                  
                  <div className="task-content">
                    {editingTask === task._id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="edit-input"
                          autoFocus
                        />
                        <select 
                          value={editPriority} 
                          onChange={(e) => setEditPriority(e.target.value)}
                          className="edit-priority"
                        >
                          <option value="low">🟢 Low</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="high">🔴 High</option>
                        </select>
                        <button onClick={saveEdit} className="save-btn">Save</button>
                        <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="task-main">
                          <span 
                            className="task-title"
                            onClick={() => toggleTask(task._id)}
                          >
                            {task.title}
                          </span>
                          <div className="task-meta">
                            <span 
                              className="priority-badge"
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                              onClick={() => updateTaskPriority(task._id, 
                                task.priority === 'high' ? 'medium' : 
                                task.priority === 'medium' ? 'low' : 'high'
                              )}
                            >
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                            <span className="task-date">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button onClick={() => startEdit(task)} className="edit-btn">
                            ✏️
                          </button>
                          <button onClick={() => deleteTask(task._id)} className="delete-btn">
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
