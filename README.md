# Taskflow — Task Manager

A clean, responsive task manager built with **Next.js, React, TypeScript, and CSS**. It is designed to be pushed to GitHub and deployed on Vercel.

## Features

- Create, edit, and delete tasks
- Set start dates and due dates
- Set Low, Medium, or High priority
- Track status: Not started, In progress, or Completed
- Track progress from 0–100%
- Dashboard cards for total, active, completed, and overdue tasks
- Overall progress indicator
- Search, filter, and sort tasks
- Responsive layout for desktop and mobile
- Automatically saves tasks in browser `localStorage`

## Important data-storage note

This starter version stores tasks **locally in the browser on the device where you use it**. It does not use a database or user accounts, so tasks will not automatically sync between devices or browsers. Clearing browser site data can remove locally saved tasks.

For cross-device sync, add a database and authentication later (for example, Supabase).

## Requirements

- Node.js 20.9 or newer
- npm
- A GitHub account
- A Vercel account

## Run locally

1. Unzip the project.
2. Open Terminal in the unzipped `taskflow-task-manager` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

To make a production build locally:

```bash
npm run build
npm start
```

## Push to GitHub

Create a **new empty repository** on GitHub. Do not add a README or `.gitignore` there because this project already contains them.

In Terminal, from inside this project folder, run:

```bash
git init
git add .
git commit -m "Initial Taskflow app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository URL.

## Deploy on Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Choose **Add New → Project**.
3. Import the GitHub repository you just created.
4. Keep the detected framework as **Next.js**.
5. Leave the build settings at their defaults.
6. Click **Deploy**.

Vercel will build and publish the app. Future pushes to the connected GitHub branch will trigger a new deployment automatically.

## Project structure

```text
taskflow-task-manager/
├── app/
│   ├── globals.css      # App styling and responsive layout
│   ├── layout.tsx       # Root layout and page metadata
│   └── page.tsx         # Task manager UI and app logic
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Useful next upgrades

1. Add Supabase for secure cloud storage and cross-device sync.
2. Add reminders using email or push notifications.
3. Add recurring tasks and calendar views.
4. Add projects and task categories.

Start with the current version, test the workflow, and add these only when you know you need them.
