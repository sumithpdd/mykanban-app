# My Kanban Task Management App

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
