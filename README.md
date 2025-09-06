# 📝 Task Tracker Pro

A modern, feature-rich TODO application built with React and Node.js/Express. This application provides a comprehensive task management solution with advanced features and a beautiful, responsive user interface.

## ✨ Features

### 🎯 Core Functionality
- **Add Tasks**: Create new tasks with titles and priority levels
- **Edit Tasks**: Inline editing of task titles and priorities
- **Delete Tasks**: Remove individual tasks
- **Toggle Completion**: Mark tasks as complete/incomplete
- **Priority System**: Three priority levels (High 🔴, Medium 🟡, Low 🟢)

### 🔍 Advanced Features
- **Search**: Real-time search through task titles
- **Filtering**: Filter by completion status or priority level
- **Sorting**: Sort tasks by date, priority, or title
- **Bulk Operations**: Select multiple tasks for batch actions
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Data Persistence**: Tasks are saved to a JSON file and persist between sessions

### 🎨 User Experience
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback for all actions
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during API operations
- **Keyboard Support**: Press Enter to add tasks quickly

### 🚀 Technical Features
- **RESTful API**: Complete CRUD operations with Express.js
- **Data Validation**: Server-side validation for all inputs
- **CORS Support**: Cross-origin resource sharing enabled
- **File Storage**: JSON-based data persistence
- **Concurrent Development**: Run frontend and backend simultaneously

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd TODO-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```
   This command starts both the backend server (port 5000) and frontend development server (port 3000) simultaneously.

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Alternative Commands

- **Run backend only**: `npm run server`
- **Run frontend only**: `npm start`
- **Build for production**: `npm run build`

## 📁 Project Structure

```
TODO-App/
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Modern styling
│   └── index.js        # React entry point
├── server.js           # Express backend server
├── tasks.json          # Data persistence file (auto-generated)
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔧 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (supports query parameters for filtering, searching, sorting)
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update task completion status or priority
- `PUT /api/tasks/:id` - Update task title and priority
- `DELETE /api/tasks/:id` - Delete a task

### Bulk Operations
- `POST /api/tasks/bulk` - Perform bulk actions on multiple tasks

### Query Parameters
- `search` - Search tasks by title
- `filter` - Filter by status (completed, pending) or priority (high, medium, low)
- `sort` - Sort by date, priority, or title

## 🎨 UI Components

### Header Section
- Application title with emoji
- Progress statistics
- Visual progress bar

### Task Input Section
- Text input for new tasks
- Priority selector dropdown
- Add button with validation

### Filter & Search Section
- Search input for task filtering
- Filter dropdown (All, Pending, Completed, Priority levels)
- Sort dropdown (Date, Priority, Title)

### Bulk Actions
- Select all checkbox
- Individual task selection
- Bulk complete/incomplete/delete operations

### Task List
- Individual task items with:
  - Selection checkbox
  - Task title (clickable to toggle completion)
  - Priority badge (clickable to cycle through priorities)
  - Creation date
  - Edit and delete buttons
  - Inline editing capability

## 🎯 Usage Guide

### Adding Tasks
1. Type your task in the input field
2. Select a priority level (Low, Medium, High)
3. Click "Add Task" or press Enter

### Managing Tasks
- **Complete/Incomplete**: Click on the task title
- **Edit**: Click the edit button (✏️) to modify title and priority
- **Delete**: Click the delete button (🗑️) to remove a task
- **Change Priority**: Click on the priority badge to cycle through levels

### Bulk Operations
1. Select individual tasks using checkboxes
2. Use "Select All" to select all visible tasks
3. Choose from bulk actions: Mark Complete, Mark Incomplete, Delete Selected

### Filtering & Searching
- **Search**: Type in the search box to find tasks by title
- **Filter**: Use the filter dropdown to show specific task types
- **Sort**: Use the sort dropdown to organize tasks by different criteria

## 🔒 Data Persistence

Tasks are automatically saved to `tasks.json` in the project root. This file is created automatically when you first run the application and contains all your tasks in JSON format.

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
The application uses default ports (3000 for frontend, 5000 for backend). To change these, modify the `package.json` proxy setting and the `PORT` variable in `server.js`.

## 🤝 Contributing

Feel free to contribute to this project by:
1. Adding new features
2. Improving the UI/UX
3. Fixing bugs
4. Adding tests
5. Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy Your Enhanced TODO App!

Your Task Tracker Pro is now ready with all the modern features you need for efficient task management. The beautiful interface, advanced functionality, and robust backend make it a professional-grade application perfect for personal or professional use.