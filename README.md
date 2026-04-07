# HMCTS Task Manager --- Backend

REST API for the HMCTS task management system built with Node.js, Express, and PostgreSQL.

## 🚀 Tech Stack

- **Node.js / Express** --- Backend framework

- **PostgreSQL** --- Relational database

- **Jest / Supertest** --- Testing suite

## 🛠 Getting Started

### Prerequisites

- Node.js (v18 or higher)

- **PostgreSQL** installed and running on your local machine.

### Installation

1.  **Clone the repository** `git clone <your-repository-url>` `cd task-manager-backend`

2.  **Install dependencies** `npm install`

3.  **Configure Environment Variables** This project uses different environment files for development and testing. Create the following files in the root directory:

    **Create `.env.development`**

    Plaintext

    ```
    DB_USER=your_postgres_username
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=task_manager_dev
    PORT=3000

    ```

    **Create `.env.test`**

    Plaintext

    ```
    DB_USER=your_postgres_username
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=task_manager_test
    PORT=3001

    ```

### 🗄 Database Setup (Required before running)

You must initialize the local database schema and seed it for both development and testing environments.

1.  **Development Database:** `npm run setup-db` `npm run seed`

2.  **Test Database:** `NODE_ENV=test npm run setup-db`

### Running the API

Start the development server: `npm run dev`

The API will be available at **http://localhost:3000/api**.

### Running Tests

Execute the test suite using: `npm test`

## 📡 API Endpoints

| Method     | Endpoint                | Description                    |
| ---------- | ----------------------- | ------------------------------ |
| **POST**   | `/api/tasks`            | Create a new task              |
| **GET**    | `/api/tasks`            | Retrieve all tasks             |
| **GET**    | `/api/tasks/:id`        | Retrieve a specific task by ID |
| **PATCH**  | `/api/tasks/:id/status` | Update task status             |
| **DELETE** | `/api/tasks/:id`        | Remove a task                  |

Export to Sheets

## 📝 Task Schema

JSON

```
{
  "id": 1,
  "title": "Review case documents",
  "description": "Case file analysis",
  "status": "pending",
  "dueDate": "2026-04-10T09:00:00Z",
  "created_at": "2026-04-06T12:00:00Z"
}

```

## ✅ Valid Status Values

- `pending`

- `in-progress`

- `completed`

## 🛡 License

Built for the DTS Technical Assessment.
