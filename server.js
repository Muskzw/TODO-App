const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Load tasks from file or create default tasks
let tasks = [];
let nextId = 1;

const loadTasks = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      tasks = JSON.parse(data);
      nextId = Math.max(...tasks.map(t => parseInt(t._id)), 0) + 1;
    } else {
      // Default tasks
      tasks = [
        { _id: '1', title: 'Learn React', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
        { _id: '2', title: 'Build TODO App', completed: false, priority: 'high', createdAt: new Date().toISOString() },
        { _id: '3', title: 'Deploy to production', completed: true, priority: 'low', createdAt: new Date().toISOString() }
      ];
      nextId = 4;
      saveTasks();
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    tasks = [];
    nextId = 1;
  }
};

const saveTasks = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Load tasks on startup
loadTasks();

// Routes
app.get('/api/tasks', (req, res) => {
  const { filter, search, sort } = req.query;
  let filteredTasks = [...tasks];

  // Search functionality
  if (search) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter functionality
  if (filter) {
    switch (filter) {
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      case 'pending':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'high':
        filteredTasks = filteredTasks.filter(task => task.priority === 'high');
        break;
      case 'medium':
        filteredTasks = filteredTasks.filter(task => task.priority === 'medium');
        break;
      case 'low':
        filteredTasks = filteredTasks.filter(task => task.priority === 'low');
        break;
    }
  }

  // Sort functionality
  if (sort) {
    switch (sort) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'date':
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'title':
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }

  res.json(filteredTasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, priority = 'medium' } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask = {
    _id: nextId.toString(),
    title: title.trim(),
    completed: false,
    priority,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  nextId++;
  saveTasks();
  
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed, priority } = req.body;
  const task = tasks.find(t => t._id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (completed !== undefined) {
    task.completed = completed;
  }
  if (priority !== undefined) {
    task.priority = priority;
  }
  
  saveTasks();
  res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, priority } = req.body;
  const task = tasks.find(t => t._id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (title !== undefined) {
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    task.title = title.trim();
  }
  if (priority !== undefined) {
    task.priority = priority;
  }
  
  saveTasks();
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t._id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  saveTasks();
  res.status(204).send();
});

// Bulk operations
app.post('/api/tasks/bulk', (req, res) => {
  const { action, taskIds } = req.body;
  
  if (!action || !taskIds || !Array.isArray(taskIds)) {
    return res.status(400).json({ error: 'Invalid bulk operation' });
  }
  
  const updatedTasks = [];
  
  taskIds.forEach(id => {
    const task = tasks.find(t => t._id === id);
    if (task) {
      switch (action) {
        case 'complete':
          task.completed = true;
          updatedTasks.push(task);
          break;
        case 'uncomplete':
          task.completed = false;
          updatedTasks.push(task);
          break;
        case 'delete':
          const index = tasks.findIndex(t => t._id === id);
          if (index !== -1) {
            tasks.splice(index, 1);
          }
          break;
      }
    }
  });
  
  saveTasks();
  res.json({ updatedTasks, action });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
