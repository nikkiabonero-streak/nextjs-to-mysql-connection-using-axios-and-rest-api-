# NEXTJS-MYSQL-using-AXIOS-and-REST-API

A simple CRUD application built with Next.js, MySQL, Axios, and REST API.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- GET all users
- POST create a new user
- PUT update a user by ID
- DELETE remove a user by ID

## Environment Variables

Create `.env.local`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=your_db_name
```

## API Endpoints

- `GET /api/users` — fetch all users
- `POST /api/users` — create a new user
- `PUT /api/users/:id` — update a user
- `DELETE /api/users/:id` — delete a user

## Tech Stack

- Next.js 16
- MySQL
- Axios
- REST API (App Router)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
