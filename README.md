# Absensi Rajawali

**A T3 Stack–powered attendance application (absensi).**

This project leverages the [T3 Stack](https://create.t3.gg) to provide a modern, full-stack solution for attendance management.

---

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)
  - [Setup](#setup)

- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

This is a T3 Stack–bootstrapped project for building an attendance (“absensi”) application. It uses modern technologies like Next.js, tRPC, Tailwind CSS, Prisma, Drizzle ORM, and BetterAuth for a seamless full-stack experience.

---

## Tech Stack

- **Next.js** – React framework for building fast, user-friendly web applications.
- **tRPC** – Type-safe, end-to-end API layer.
- **BetterAuth** – Authentication and session management.
- **Drizzle ORM** – Alternative lightweight ORM option.
- **PostgreSQL** – Database for storing user data and attendance records.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **T3 Stack (create-t3-app)** – Project scaffolding tool that sets up the above stack.

---

## Features

- Fully typed from frontend to backend via tRPC.
- Secure authentication using BetterAuth.
- Flexible database interactions with Drizzle ORM.
- Responsive UI powered by Tailwind CSS.
- Ready for quick deployment on Vercel, Netlify, or Docker.

---

## Getting Started

### Prerequisites

Ensure the following are installed:

- Node.js v23.11.0 (LTS recommended)
- PostgreSQL v17.4

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jhokam/absensi-rajawali
   cd absensi-rajawali
   ```

2. Copy the environment example file:

   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your database and authentication credentials.

4. Install dependencies:

   ```bash
   bun install
   ```

---

## Configuration

- Update `.env` with your database connection URL.
- Configure authentication keys (for e.g., BetterAuth providers).
- See `drizzle.config.ts` for Drizzle ORM settings and migrations.

---

## Development

Start the development server:

```bash
bun dev
```

Open `http://localhost:3000` to explore the app.

---

## Deployment

You can deploy using any of these:

- **Vercel** – ideal for Next.js apps.
- **Netlify** – static and serverless functions support.
- **Docker** – containerized deployment (if you prefer Docker workflows).

---

## Database Setup

- Run migrations using Drizzle as configured in the project.

---

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   └── server/
├── .env.example
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── postcss.config.js
├── bun.lock
├── tsconfig.json
└── start-database.sh
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request detailing your changes for review.

---

## License

[MIT License](LICENSE)

---
