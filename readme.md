# My Kanban Task Management App

Modern, full-stack Kanban with OKRs, built with Next.js App Router, TypeScript, Tailwind CSS, Redux Toolkit + RTK Query, NextAuth (Google), Firebase Firestore, and dnd-kit.

## ✨ Features

- **🔐 Secure Authentication**: Google OAuth integration with NextAuth.js
- **📝 Kanban Board**: Drag-and-drop task management with multiple boards
- **🎯 OKR Management**: Track Objectives and Key Results with progress monitoring
- **🏷️ Task Organization**: Tags, assignments, due dates, time tracking
- **📊 Progress Tracking**: Visual progress bars and status indicators
- **✅ Checklists**: Subtask tracking within cards
- **📝 Rich Text**: TinyMCE editor for detailed descriptions
- **⚡ Real-time Updates**: Live data synchronization with Firebase Firestore
- **🔄 Advanced State Management**: Redux Toolkit with RTK Query
- **📱 Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **🛡️ Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Firestore
- Google OAuth credentials

### Setup

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd mykanban-app
   npm install
   ```

2. **Configure environment** - Create `.env.local` from `env-template.txt`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # ... other Firebase config
   NEXT_PUBLIC_TINYMCE_API_KEY=...
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

### Seed Data

To populate with sample OKRs and tasks:

```bash
# Windows PowerShell
$env:GOOGLE_APPLICATION_CREDENTIALS="path\to\serviceAccountKey.json"
node data-migration/seed-categories.js
node data-migration/seed-okrs-with-tasks.js your-email@example.com
```

See [OKR Setup Guide](docs/OKR_SETUP_GUIDE.md) for detailed instructions.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: NextAuth.js with Google Provider
- **Database**: Firebase Firestore
- **Drag & Drop**: @dnd-kit
- **Rich Text**: TinyMCE
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/    # NextAuth configuration
│   ├── components/                 # UI components
│   │   ├── BoardTasks.tsx         # Kanban board with drag-and-drop
│   │   ├── OKRBoard.tsx           # OKR management interface
│   │   ├── Navbar.tsx             # Navigation
│   │   ├── Sidebar.tsx            # Board selector
│   │   └── common/                # Reusable components
│   ├── okrs/                      # OKR pages
│   └── utils/
│       └── firebaseConfig.ts      # Firebase initialization
├── redux/
│   ├── features/
│   │   └── appSlice.ts            # UI state management
│   ├── services/
│   │   └── apiSlice.ts            # RTK Query API endpoints
│   └── store.ts                   # Redux store configuration
└── middleware.ts                   # Auth route protection

data-migration/                     # Seed scripts
docs/                               # Documentation
```

## 📊 Data Model

### Collections

**users**: User profiles with approval status
```typescript
{ id, email, name, avatar, isApproved, createdAt, updatedAt }
```

**boards**: Kanban boards with columns and tasks
```typescript
{
  id, ownerId, name, description, createdAt, updatedAt,
  columns: [{
    id, name,
    tasks: [{
      id, title, description, status, order,
      tags[], assignedTo[], dueDate,
      okrId?, keyResultId?,  // Link to OKRs
      startDate?, progress?,
      timeSpent, timeEstimate,
      checklistItems[], notes
    }]
  }]
}
```

**okrs**: Objectives and Key Results
```typescript
{
  id, ownerId, objective, status, progress,
  category[], startDate?, endDate?,
  archived, isOrganizational,
  keyResults: [{
    id, text, completed,
    targetValue?, currentValue?
  }],
  createdAt, updatedAt
}
```

**categories**: OKR category definitions
```typescript
{ id, name, description, color, isDefault, createdAt, updatedAt }
```

**tags**: Task tags with colors
```typescript
{ id, name, color, description, createdAt, updatedAt }
```

## 📖 Documentation

### 🚀 New to the Project?

**Start here for a complete understanding:**
- **[Junior Developer Guide](docs/JUNIOR_DEV_GUIDE.md)** ⭐ **Complete setup and learning path**
- **[Application Journey](docs/APPLICATION_JOURNEY.md)** - End-to-end user experience and flows
- **[Getting Started](docs/GETTING_STARTED.md)** - Quick setup instructions

### 🏗️ Architecture & Design
- [Architecture Overview](docs/ARCHITECTURE.md) - System design and patterns
- [Data Model](docs/DATA_MODEL.md) - Complete Firestore schema
- [Project Brief](docs/PROJECT_BRIEF.md) - Goals and roadmap

### 🔧 Setup & Configuration
- [Authentication Setup](docs/AUTHENTICATION.md) - Google OAuth configuration
- [Firebase Setup](docs/FIREBASE_SETUP.md) - Firestore configuration
- [Redux Setup](docs/REDUX_SETUP.md) - State management patterns

### 📝 Features
- [OKR Setup Guide](docs/OKR_SETUP_GUIDE.md) - OKR system setup
- [OKR Feature Documentation](docs/OKR_FEATURE.md) - Complete OKR guide
- [Advanced Features](docs/ADVANCED_FEATURES.md) - Tags, time tracking, checklists
- [Drag and Drop](docs/DRAG_AND_DROP.md) - @dnd-kit implementation

### 💻 Development
- [Developer Guide](docs/DEV_GUIDE.md) - Development workflow
- [CRUD Operations](docs/CRUD_OPERATIONS.md) - API implementation
- [UI Components](docs/UI_COMPONENTS.md) - Component library

### 🔧 Troubleshooting
- [Troubleshooting Guide](docs/TROUBLESHOOTING_NO_DATA.md) - Common issues and solutions

## 🔒 Security

- Firebase security rules enforce user ownership
- NextAuth middleware protects routes
- HTML sanitization (DOMPurify) for rich text
- Environment variables for sensitive data (never commit `.env.local`)

## 🚢 Development Workflow

### Best Practices
- UI state in `appSlice.ts` (minimal, serializable)
- Server interactions in `apiSlice.ts` (single source of truth)
- Prefer RTK Query mutations for updates
- Keep components presentational
- Use IDs for relations (not objects)

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔮 Future Enhancements

- Dark mode theme switching
- File attachments
- Comments and collaboration
- Subtasks and dependencies
- Task templates
- Analytics and reporting
- Real-time notifications
- Offline PWA support
- Team sharing and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

### For Developers

1. **New to the project?** → [Junior Developer Guide](docs/JUNIOR_DEV_GUIDE.md)
2. **Understanding the app?** → [Application Journey](docs/APPLICATION_JOURNEY.md)
3. **Setup issues?** → [Getting Started Guide](docs/GETTING_STARTED.md)
4. **OKR problems?** → [OKR Setup Guide](docs/OKR_SETUP_GUIDE.md)
5. **Data not showing?** → [Troubleshooting Guide](docs/TROUBLESHOOTING_NO_DATA.md)
6. **Still stuck?** → Open an issue on GitHub

### Security

- 🔒 [SECURITY.md](SECURITY.md) - Security best practices and audit checklist

---

**Happy coding! 🎉**
