# **alexoluwaseyi-ngoane**

A **Next.js** project with **Prisma** for database management, **TypeScript** for type safety, and a structured API for handling test-related data.

## **Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## **Overview**

This project is a **Next.js** application that provides an interface for managing tests. It uses:

- **Prisma** as the ORM for database interactions.
- **TypeScript** for strict typing and maintainability.
- **Zod** for schema validation.
- **Tailwind CSS (PostCSS)** for styling.
- **ESLint** for linting and code quality.

---

## **Features**

- API for managing test records.
- Modular React components for UI reusability.
- Prisma database schema for structured data management.
- Server-side rendering and API routes.

---

## **Project Structure**

```
alexoluwaseyi-ngoane/
├── README.md               # Project documentation
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration for styling
├── tsconfig.json           # TypeScript configuration
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma schema for database structure
│   └── migrations/         # Database migrations
│       ├── migration_lock.toml
│       └── 20250305082235_init/
│           └── migration.sql
├── public/                 # Static assets (images, icons, etc.)
└── src/                    # Source code
    ├── app/                # Next.js app directory (pages, layouts, API)
    │   ├── globals.css     # Global styles
    │   ├── layout.tsx      # Main layout component
    │   ├── page.tsx        # Home page component
    │   ├── api/            # API routes
    │   │   └── tests/      # Test-related API endpoints
    │   │       ├── route.ts          # Main test API handler
    │   │       └── [id]/route.ts      # Single test API handler
    │   └── tests/          # UI pages for tests
    │       ├── page.tsx           # Tests listing page
    │       └── [id]/page.tsx      # Test details page
    ├── components/          # Reusable UI components
    │   ├── Footer.tsx      # Footer component
    │   ├── Header.tsx      # Header component
    │   ├── Landing.tsx     # Landing section
    │   ├── LandingPage.tsx # Landing page component
    │   ├── TestDetails.tsx # Test details component
    │   ├── Tests.tsx       # Tests listing component
    │   └── modals/         # Modals for CRUD operations
    │       ├── CreateModal.tsx  # Modal for creating a test
    │       ├── DeleteModal.tsx  # Modal for deleting a test
    │       └── EditModal.tsx    # Modal for editing a test
    ├── lib/                 # Utility functions
    │   ├── ErrorHandler.ts  # Centralized error handling
    │   ├── prisma.ts        # Prisma client setup
    │   └── zodSchema.ts     # Zod validation schemas
    └── types/               # Type definitions
        └── TestRecord.tsx   # Type definition for test records
```

---

## **Installation**

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-username/alexoluwaseyi-ngoane.git
   cd alexoluwaseyi-ngoane
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Setup the database**

   - Create a `.env` file and configure your database connection:
     ```
     DATABASE_URL="your-database-connection-string"
     ```
   - Run Prisma migrations:
     ```sh
     npx prisma migrate dev --name init
     ```

4. **Run the development server**

   ```sh
   npm run dev
   ```

---

## **Environment Variables**

Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL="your-database-connection-string"
```

---

## **Scripts**

Available commands in `package.json`:

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start the development server     |
| `npm run build`  | Build the project for production |
| `npm run start`  | Start the production server      |
| `npm run lint`   | Run ESLint for code linting      |
| `npm run prisma` | Run Prisma CLI commands          |

---

## **Usage**

1. **Start the development server**
   ```sh
   npm run dev
   ```
2. **Access the application** at `http://localhost:3000/`.

---

## **API Endpoints**

### **Tests API**

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/api/tests`     | Fetch all tests             |
| POST   | `/api/tests`     | Create a new test           |
| GET    | `/api/tests/:id` | Fetch a specific test by ID |
| PUT    | `/api/tests/:id` | Update a test by ID         |
| DELETE | `/api/tests/:id` | Delete a test by ID         |

---

## **Contributing**

1. Fork the repository.
2. Create a feature branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push the branch:
   ```sh
   git push origin feature-name
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---
