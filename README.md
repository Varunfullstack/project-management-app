# Project Management App

A simple project management application built with React, Vite, and JSON Server. It allows users to add, edit, delete, and favorite projects. The app also includes pagination for better data management.

## Features

- **Add Project:**  
  Add a new project with details like name, description, start date, end date, and project manager.

- **Edit Project:**  
  Update the details of an existing project.

- **Delete Project:**  
  Remove a project from the list.

- **Favorite Projects:**  
  Mark projects as favorites and view them in a sidebar.

- **Responsive Design:**  
  The app is optimized for both desktop and mobile devices.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web development.
- **JSON Server:** A fake REST API for mocking backend services.
- **Material-UI (MUI):** A popular React UI framework for styling components.
- **React Router:** For handling routing in the application.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- **Node.js:** Make sure you have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).
- **npm:** npm is bundled with Node.js, so you don't need to install it separately.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Varunfullstack/project-management-app.git
   cd project-management-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the JSON Server:**
   ```bash
   npm run server
   ```
   This will start the JSON Server on [http://localhost:3001](http://localhost:3001).

4. **Start the React App:**
   In a new terminal, start the React app:
   ```bash
   npm run dev
   ```

Your application should now be running locally! 🎉
