# Topographe Manager

A modern and responsive web application designed to simplify the management of topography projects and related professional activities.

Built with **React, Laravel, and MySQL**, Topographe Manager provides an intuitive interface for managing clients, projects, missions, interventions, documents, technical reports, quotations, and invoices.

## About the Project

Topographe Manager is a web-based management platform created to help topography professionals organize their work, centralize project information, and monitor their daily activities through a clear and user-friendly interface.

The application follows a frontend/backend architecture, combining React for the user interface with Laravel for backend services and API management.

## Features

- **Dashboard:** View key statistics and project activity.
- **Client Management:** Organize client information.
- **Project Management:** Create and manage topography projects.
- **Mission Management:** Organize professional missions.
- **Intervention Tracking:** Monitor planned, ongoing, completed, and cancelled interventions.
- **Document Management:** Keep project-related documents organized.
- **Photo Management:** Manage photos associated with projects.
- **Technical Reports:** Organize project reports.
- **Quotations and Invoices:** Manage commercial and financial documents.
- **User Authentication:** Secure access to application features.
- **Role-Based Access:** Organize permissions for administrators, topographers, and technicians.
- **Responsive Interface:** Access the application through a modern web interface.

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- PHP
- Laravel
- Laravel Sanctum
- REST API

### Database
- MySQL

## Project Architecture

- **Frontend:** React application responsible for the user interface and navigation.
- **Backend:** Laravel application responsible for business logic, authentication, and API endpoints.
- **Database:** Stores clients, projects, missions, interventions, and other application information.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- PHP
- Composer
- MySQL

### 1. Clone the Repository

```bash
git clone https://github.com/Ayoub-Ait-Sayed/topographe-manager.git
cd topographe-manager
```

### 2. Configure the Backend

```bash
cd backend
composer install
```

Configure your `.env` file with your local database credentials. If `.env.example` exists, you can copy it to `.env`.

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend API URL to point to your local Laravel backend.

## Project Structure

```text
topographe-manager/
├── backend/       # Laravel backend and REST API
├── frontend/      # React frontend
├── .gitignore
└── README.md
```

## Future Improvements

- Enhanced reporting and data visualization.
- PDF export for technical reports and invoices.
- Improved project monitoring.
- Additional interface and usability enhancements.


