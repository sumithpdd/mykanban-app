# My Kanban Task Management App

Modern, full‑stack Kanban built with Next.js App Router, TypeScript, Tailwind CSS, Redux Toolkit + RTK Query, NextAuth (Google), Firebase Firestore, and dnd-kit.

## Documentation

- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Data Model: [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- Developer Guide: [docs/DEV_GUIDE.md](docs/DEV_GUIDE.md)

## Quick Start

1. Prerequisites: Node 18+, a Firebase project, Google OAuth credentials
2. Clone and install
```bash
npm install
```
3. Create `.env.local` from `env-template.txt` and fill real values
4. Run
```bash
npm run dev
```

## Environment Variables

See `env-template.txt` for all keys. Critical ones:
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- NEXTAUTH_SECRET / NEXTAUTH_URL
- NEXT_PUBLIC_FIREBASE_* (apiKey, projectId, etc.)
- NEXT_PUBLIC_TINYMCE_API_KEY

## Tech Overview (with docs)

- Next.js App Router (Client/Server Components, Route Handlers)
  - https://nextjs.org/docs/app
- TypeScript everywhere
  - https://www.typescriptlang.org/docs/
- Tailwind CSS for utility styling
  - https://tailwindcss.com/docs
- Redux Toolkit + RTK Query for state and data fetching
  - https://redux-toolkit.js.org/
  - https://redux-toolkit.js.org/rtk-query/overview
- NextAuth (Google) for authentication
  - https://authjs.dev/
- Firebase Firestore for data
  - https://firebase.google.com/docs/firestore
- dnd-kit for drag-and-drop
  - https://docs.dndkit.com/
- TinyMCE for rich text descriptions
  - https://www.tiny.cloud/docs/

## Project Structure

```
src/
  app/                # App Router
    components/       # UI components (Navbar, Sidebar, BoardTasks, Modals)
  redux/
    features/         # UI state (appSlice)
    services/         # RTK Query apiSlice (Firestore endpoints)
  ...
data-migration/       # Safe utility scripts (diagnose/fix/populate)
docs/                 # Developer docs
```

## Data Model (Firestore)

- users: { id, email, name, avatar, createdAt, updatedAt }
- tags: { id, name, color, description, createdAt, updatedAt }
- boards: { id, ownerId, name, description, columns[], createdAt, updatedAt }
  - columns: { id, name, tasks[] }
  - tasks: {
      id, title, description (HTML), status, order,
      tags[string], assignedTo[string],
      dueDate?, createdAt, createdBy?, updatedAt, updatedBy?,
      completedDate?, timeSpent (min), timeEstimate? (min),
      checklistItems?: [{ id, text, completed, createdAt, updatedAt }],
      notes?
    }

## App Flow

1. Authentication via NextAuth (Google)
2. On load, `useGetCurrentUserQuery` ensures the user exists in `users`
3. Boards fetched with `useFetchBoardsQuery` scoped by `ownerId`
4. UI state (current board, modals) handled in `appSlice`
5. CRUD via RTK Query endpoints in `apiSlice.ts`
6. Drag and drop via dnd-kit updates task positions and sets `completedDate` when dropped in the last column
7. Rich descriptions (HTML) are sanitized with DOMPurify when rendering on task cards

## Development Workflow

- UI state in `appSlice.ts` (keep it minimal and serializable)
- Server interactions in `apiSlice.ts` (one place for Firestore logic)
- Prefer RTK Query mutations for updates; avoid manual fetches
- Keep components presentational; derive data via hooks
- Use IDs (not objects) for relations: `assignedTo: string[]`, `tags: string[]`

## Accessibility & UX

- Keyboard-friendly checklist (Enter adds item; no form submits)
- Double-click task to open Edit
- Cards show sanitized HTML description and small checklist preview

## Scripts

See `data-migration/README.md` for diagnose/fix/populate utilities.

## Contributing Notes for Juniors

Start here:
1. Read docs in `docs/`
2. Trace the flow: `layout.tsx` → `Navbar/Sidebar` → `BoardTasks` → modals
3. Understand RTK Query endpoints in `apiSlice.ts`
4. When adding fields, update: Type (`ITask`), forms (modals), and mutations

### Useful Concepts

- Client vs Server Components: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-client-components
- React hooks rules: https://react.dev/reference/rules/rules-of-hooks
- Firestore array/object updates: https://firebase.google.com/docs/firestore/manage-data/add-data
- DnD strategies: https://docs.dndkit.com/presets/sortable

## Security & Best Practices

- Never commit `.env.local`
- Sanitize HTML (DOMPurify) when rendering descriptions
- Guard mutations with server-side validation where appropriate
- Keep console logs behind `if (process.env.NODE_ENV !== 'production')`


A full-stack Kanban task management application built with modern web technologies. This app allows users to organize and manage their tasks using a drag-and-drop Kanban board interface with real-time updates and persistent data storage.

## 📚 Documentation

- **[Project Brief](docs/PROJECT_BRIEF.md)** - Project overview, goals, and roadmap
- **[Getting Started](docs/GETTING_STARTED.md)** - Quick setup and installation guide
- **[Authentication Setup](docs/AUTHENTICATION.md)** - Google OAuth with NextAuth.js
- **[Redux Store Configuration](docs/REDUX_SETUP.md)** - State management with RTK Query
- **[UI Components Implementation](docs/UI_COMPONENTS.md)** - Building the interface
- **[Firebase Firestore Integration](docs/FIREBASE_SETUP.md)** - Database setup and configuration
- **[CRUD Operations Implementation](docs/CRUD_OPERATIONS.md)** - Complete functionality guide
- **[Drag and Drop Implementation](docs/DRAG_AND_DROP.md)** - Modern drag and drop with @dnd-kit
- **[Advanced Task Features](docs/ADVANCED_FEATURES.md)** - Tags, assignments, time tracking, and more

## 🚀 Quick Start

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd mykanban-app
   npm install
   ```

2. **Set up environment variables** in `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_SECRET=your_generated_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```
   
   **Generate NextAuth Secret**: Run `node generate-secret.js` to generate a secure secret

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

> 📖 **For detailed setup instructions, see [Getting Started Guide](docs/GETTING_STARTED.md)**

## ✨ Features

- **🔐 Secure Authentication**: Google OAuth integration with NextAuth.js for secure, trusted login
- **📝 Complete CRUD Operations**: Full Create, Read, Update, Delete functionality for both boards and tasks
- **🎯 Interactive Modals**: Dynamic modals for adding/editing/deleting boards and tasks with form validation
- **🗑️ Safe Deletion**: Confirmation modals for all delete operations to prevent accidental data loss
- **⚡ Real-time Updates**: Live data synchronization with Firebase Firestore
- **🔄 Advanced State Management**: Redux Toolkit with RTK Query for efficient data handling
- **📱 Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **🛡️ Type Safety**: Full TypeScript implementation for better development experience
- **👤 User Profiles**: Access to verified user information (name, email, profile picture)
- **🔒 Protected Routes**: Middleware-based route protection ensuring only authenticated users can access the app
- **✅ Form Validation**: Client-side validation with error messaging and auto-clear functionality
- **🎨 Modern UI**: Clean, intuitive interface with loading states and user feedback
- **🎯 Drag & Drop**: Modern drag and drop functionality using @dnd-kit for seamless task movement
- **🏷️ Multiple Tags**: Color-coded tags for task categorization and organization
- **👥 User Assignments**: Assign tasks to multiple team members with avatar display
- **📅 Due Dates**: Set deadlines with overdue detection and visual indicators
- **⏱️ Time Tracking**: Track time estimates and actual time spent on tasks
- **📝 Rich Descriptions**: Detailed task descriptions for better context and clarity
- **📊 Timestamps**: Automatic creation and update timestamps for audit trails

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: NextAuth.js with Google Provider
- **Database**: Firebase Firestore
- **Drag & Drop**: @dnd-kit (modern, accessible drag and drop)
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   ├── route.ts
│   │   └── options.ts
│   ├── components/
│   │   ├── AddAndEditBoardModal.tsx
│   │   ├── AddAndEditTaskModal.tsx
│   │   ├── BoardTasks.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── utils/
│   │   ├── firebaseConfig.ts
│   │   └── data.js
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── redux/
│   ├── features/
│   │   └── appSlice.ts
│   ├── services/
│   │   └── apiSlice.ts
│   ├── store.ts
│   ├── hooks.ts
│   ├── provider.tsx
│   └── rootReducer.ts
└── middleware.ts
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Account for OAuth setup

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📖 Development Guide

For detailed development instructions, see our comprehensive documentation:

- **[Authentication Setup](docs/AUTHENTICATION.md)** - Google OAuth credentials and NextAuth.js configuration
- **[Redux Store Configuration](docs/REDUX_SETUP.md)** - State management with RTK Query setup
- **[UI Components Implementation](docs/UI_COMPONENTS.md)** - Building interactive components and modal systems
- **[Firebase Firestore Integration](docs/FIREBASE_SETUP.md)** - Database setup and real-time synchronization
- **[CRUD Operations Implementation](docs/CRUD_OPERATIONS.md)** - Complete functionality implementation
- **[Drag and Drop Implementation](docs/DRAG_AND_DROP.md)** - Modern drag and drop with @dnd-kit
- **[Advanced Task Features](docs/ADVANCED_FEATURES.md)** - Tags, assignments, time tracking, and more
- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Step-by-step setup and installation

## 🚀 Current Status

✅ **Authentication System**: Google OAuth fully implemented  
✅ **State Management**: Redux Toolkit with RTK Query configured  
✅ **Database Integration**: Firebase Firestore connected  
✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality  
✅ **Modal System**: Dynamic modals for boards and tasks with confirmation  
✅ **Form Validation**: Client-side validation with error handling  
✅ **Delete Operations**: Safe deletion with confirmation modals  
✅ **UI Components**: Responsive design with Tailwind CSS  
✅ **Type Safety**: Full TypeScript implementation  
✅ **Drag & Drop**: Modern drag and drop functionality with @dnd-kit  
✅ **Advanced Features**: Tags, assignments, time tracking, due dates, and rich descriptions  

## 🔮 Future Enhancements

- **Dark Mode**: Add theme switching capability
- **Custom Tags**: Allow users to create and manage custom tags
- **File Attachments**: Attach files and documents to tasks
- **Comments System**: Task discussion and collaboration features
- **Subtasks**: Break down complex tasks into smaller components
- **Dependencies**: Task dependency management and blocking
- **Templates**: Reusable task templates for common workflows
- **Reporting**: Time tracking and productivity reports
- **Notifications**: Real-time notifications for due dates and updates
- **Collaboration**: Board sharing and team features
- **Analytics**: Productivity tracking and reporting
- **Offline Support**: Progressive Web App capabilities
- **Multi-select**: Drag multiple tasks simultaneously
- **Nested Drag**: Implement nested drag and drop for subtasks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you have any questions or need help with the project:

1. Check the [Getting Started Guide](docs/GETTING_STARTED.md) for common issues
2. Review the [Project Brief](docs/PROJECT_BRIEF.md) for project context
3. Open an issue on GitHub with detailed information

---

**Happy coding! 🎉**
