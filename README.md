# Task Organiser App

A modern task management application built with Next.js, TypeScript, and Prisma. Organize your work with tasks, next actions, and work logging capabilities.

## Features

### 📋 Task Management

-   **Create, edit, and delete tasks** with descriptions and due dates
-   **Priority levels** to highlight important work
-   **Status tracking** (Pending, In Progress, Completed)
-   **Category organization** for better task grouping
-   **Responsive dashboard** with mobile-optimized interface

### ✅ Next Actions System

-   **Break down tasks** into actionable next steps
-   **Interactive checkboxes** to mark actions complete
-   **Completion tracking** with timestamps
-   **Clickable action cards** for detailed views
-   **Progress indicators** showing task completion percentage

### 💼 Work Logging

-   **Log work done** on both tasks and individual next actions
-   **Optional time tracking** with hours spent
-   **Chronological work history** for progress review
-   **Flexible work entries** with detailed descriptions

### 🔐 Authentication & Security

-   **NextAuth.js integration** with secure session management
-   **User isolation** - users only see their own data
-   **Protected API routes** with authentication middleware

### 📱 User Interface

-   **Modern, clean design** with Tailwind CSS
-   **Fully responsive** mobile and desktop layouts
-   **Interactive components** with real-time updates
-   **Confirmation modals** for destructive actions
-   **Intuitive navigation** between tasks and actions

## Tech Stack

-   **Frontend**: Next.js 13+ (App Router), React, TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: NextAuth.js
-   **Deployment**: Vercel-ready

## Installation

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd task-organiser-app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Fill in your environment variables:

    ```env
    DATABASE_URL="your-postgresql-connection-string"
    NEXTAUTH_SECRET="your-nextauth-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4. **Set up the database**

    ```bash
    npx prisma db push
    npx prisma generate
    ```

5. **Seed the database (optional)**

    ```bash
    npx prisma db seed
    ```

6. **Start the development server**
    ```bash
    npm run dev
    ```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## Database Schema

### Core Models

-   **User**: Authentication and user management
-   **Task**: Main task entities with status, priority, and categories
-   **NextAction**: Actionable steps associated with tasks
-   **WorkDone**: Work log entries for tasks and next actions
-   **Category**: Task categorization system

### Key Relationships

-   Users have many Tasks
-   Tasks have many NextActions and WorkDone entries
-   NextActions can have WorkDone entries
-   Tasks belong to Categories

## API Routes

### Tasks

-   `GET /api/tasks` - List all user tasks
-   `POST /api/tasks` - Create new task
-   `GET /api/tasks/[id]` - Get task details
-   `PATCH /api/tasks/[id]` - Update task
-   `DELETE /api/tasks/[id]` - Delete task

### Next Actions

-   `GET /api/tasks/[id]/next-actions` - List task's next actions
-   `POST /api/tasks/[id]/next-actions` - Create next action
-   `GET /api/next-actions/[id]` - Get next action details
-   `PATCH /api/next-actions/[id]` - Update next action (toggle completion)
-   `DELETE /api/next-actions/[id]` - Delete next action

### Work Done

-   `GET /api/tasks/[id]/work-done` - List work done for task
-   `POST /api/tasks/[id]/work-done` - Log work on task
-   `GET /api/next-actions/[id]/work-done` - List work done for next action
-   `POST /api/next-actions/[id]/work-done` - Log work on next action

## Usage

### Creating Tasks

1. Navigate to the dashboard
2. Click "Create Action"
3. Fill in task details (title, description, category, priority)
4. Set optional due date
5. Submit to create the task

### Managing Next Actions

1. Click on any task card to view details
2. Scroll to "Next Actions" section
3. Add new actions using the form
4. Check off completed actions
5. Click on actions to view detailed pages

### Logging Work

1. On any task or next action detail page
2. Use the "Log Work Done" form
3. Describe what was accomplished
4. Optionally track time spent
5. Submit to record the work

### Tracking Progress

-   Dashboard shows all tasks with status indicators
-   Task detail pages show completion percentages
-   Progress bars update in real-time as actions are completed
-   Completion timestamps track when work was finished

## Customization

### Adding New Task Statuses

Update the `TaskStatus` enum in `prisma/schema.prisma`:

```prisma
enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  ON_HOLD      // Add new status
}
```

### Custom Categories

Categories are user-manageable through the database. Consider adding a category management interface for your needs.

### Styling

The app uses Tailwind CSS. Modify styles in component files or extend the Tailwind configuration in `tailwind.config.js`.

## Development

### Database Changes

When modifying the Prisma schema:

```bash
npx prisma db push
npx prisma generate
```

### Adding New Components

Components are located in `app/components/`. Follow the existing patterns for consistency.

### API Route Structure

API routes follow Next.js 13+ App Router conventions in the `app/api/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project as a foundation for your own task management needs.

---

Built with ❤️ using Next.js and modern web technologies.
