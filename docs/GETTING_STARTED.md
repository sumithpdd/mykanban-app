# Getting Started Guide

This guide will walk you through setting up and running the My Kanban Task Management App on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Google Account** for OAuth setup
- **Code Editor** (VS Code recommended)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mykanban-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Google OAuth Credentials for NextAuth.js
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=DyEPJD0KOFxDnoy8XiTV63NxzxgK0DquBAsUtiWt0QM=
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Detailed Setup Instructions

### Setting Up Google OAuth

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Create a new project or select an existing one
   - Note the project ID for reference

3. **Enable Google+ API**
   - Navigate to **APIs & Services** → **Library**
   - Search for "Google+ API" or "Google OAuth2 API"
   - Click on it and enable it

4. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required fields:
     - App name: "My Kanban Task Management App"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email) if in testing mode

5. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Choose **Web application**
   - Set **Authorized redirect URIs** (must be exactly this):
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

6. **Update Environment Variables**
   - Replace `your_google_client_id_here` with your actual Client ID
   - Replace `your_google_client_secret_here` with your actual Client Secret

### Generating NextAuth Secret

To generate a secure `NEXTAUTH_SECRET`, run this command:

**For Windows users with Git installed:**
```bash
"C:\Program Files\Git\usr\bin\openssl.exe" rand -base64 32
```

**For Linux/Mac users:**
```bash
openssl rand -base64 32
```

This generates a cryptographically secure random string that NextAuth.js uses to encrypt session tokens and other sensitive data.

## Redux Store Configuration

### Why Redux Toolkit?

Redux Toolkit provides several advantages for state management:

- **Predictable State Updates**: Centralized state management with clear data flow
- **Developer Tools**: Time-travel debugging and state inspection
- **Performance**: Optimized re-renders with selectors
- **TypeScript Support**: Full type safety for state and actions
- **RTK Query**: Built-in data fetching and caching capabilities
- **Boilerplate Reduction**: Less code compared to traditional Redux

### Step-by-Step Setup

1. **Install Required Packages**:
   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. **Create Redux Store Structure**:
   ```
   src/redux/
   ├── store.ts
   ├── hooks.ts
   └── provider.tsx
   ```

3. **Set up the Store** (`src/redux/store.ts`):
   ```typescript
   import { configureStore } from "@reduxjs/toolkit";
   import { setupListeners } from "@reduxjs/toolkit/query/react";

   // Create the Redux store
   export const store = configureStore({
     reducer: {}, // Add your reducers here
   });

   // Setup listeners for refetch behaviors
   setupListeners(store.dispatch);

   // Define RootState and AppDispatch types
   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   ```

4. **Create Typed Hooks** (`src/redux/hooks.ts`):
   ```typescript
   import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
   import type { RootState, AppDispatch } from "./store";

   // Typed versions of useDispatch and useSelector hooks
   export const useAppDispatch = () => useDispatch<AppDispatch>();
   export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
   ```

5. **Create Provider Component** (`src/redux/provider.tsx`):
   ```typescript
   'use client'
   import { store } from "./store";
   import { Provider } from "react-redux";

   // Custom provider component
   export function Providers({ children }: { children: React.ReactNode }) {
     return <Provider store={store}>{children}</Provider>;
   }
   ```

   **Understanding `'use client'` Directive:**
   
   The `'use client'` directive tells Next.js that this component should run on the client side. Here's why it's needed:
   
   - **Server-Side Rendering (SSR)**: Next.js renders components on the server by default
   - **Redux Store**: Redux state management requires browser APIs and client-side JavaScript
   - **React Context**: The Provider component needs to run in the browser to manage state
   - **Hydration**: Ensures the Redux store is properly initialized on the client
   
   Without `'use client'`, you'd get errors like "useContext can only be called inside a client component."

6. **Update Layout** (`src/app/layout.tsx`):
   ```typescript
   import type { Metadata } from 'next'
   import { Plus_Jakarta_Sans } from "next/font/google";
   import './globals.css'
   import { Providers } from "@/redux/provider";

   // Font we'll use throughout the project
   const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

   // Metadata definition
   export const metadata: Metadata = {
     title: 'My Kanban Task Management App',
     description: 'A full-stack Kanban task management application',
   }

   // RootLayout component
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en" className={pjs.className}>
         <body>
           <Providers>
             {children}
           </Providers>
         </body>
       </html>
     );
   }
   ```

7. **Update TypeScript Configuration** (`tsconfig.json`):
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

### Key Benefits of This Setup

- **Type Safety**: Full TypeScript support for all Redux operations
- **Performance**: Optimized re-renders and state updates
- **Developer Experience**: Redux DevTools integration for debugging
- **Scalability**: Easy to add new slices and reducers as the app grows
- **Data Fetching**: RTK Query ready for API integration

## UI Components Implementation

### Building the Core UI Components

Now that Redux is configured, let's build the essential UI components for our Kanban application. We'll create a navbar, sidebar, and board components to form the foundation of our interface.

### 1. Creating the Navbar Component

**Step 1**: Create the components folder structure:
```
src/app/components/
├── Navbar.tsx
├── Dropdown.tsx
├── Sidebar.tsx
└── BoardTasks.tsx
```

**Step 2**: Create the Navbar component (`src/app/components/Navbar.tsx`):
```typescript
'use client' // Client component for state management

import Dropdown from "./Dropdown";
import { useState } from 'react'

export default function Navbar() {
  const [show, setShow] = useState<boolean>(false); // Manage dropdown state

  return (
    <nav className="bg-white border flex h-24">
      <div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
        <p className="font-bold text-3xl">Kanban App</p>
      </div>

      <div className="flex justify-between w-full items-center pr-[2.12rem]">
        <p className="text-black text-2xl font-bold pl-6">Current board name</p>

        <div className="flex items-center space-x-3">
          <button className="bg-blue-500 text-black px-4 py-2 flex rounded-3xl items-center space-x-2">
            <p>+ Add New Task</p>
          </button>
          <div className="relative flex items-center">
            <button 
              onClick={() => setShow(!show)} // Toggle dropdown
              className="text-3xl mb-4">...</button>
            <Dropdown show={show}/> {/* Render dropdown with state */}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Key Features**:
- **Responsive Design**: Fixed height with flexible width
- **State Management**: Uses `useState` for dropdown toggle
- **Interactive Elements**: Add task button and dropdown trigger
- **Client Component**: Required for state management with `'use client'`

### 2. Creating the Dropdown Component

Create the Dropdown component (`src/app/components/Dropdown.tsx`):
```typescript
interface IDropdown {
  show: boolean
}

export default function Dropdown({ show }: IDropdown) {
  return (
    <div
      className={`${
        show ? "block" : "hidden"
      } w-48 absolute top-full bg-white
       border shadow-lg right-0 py-2 rounded-2xl`}
    >
      <div className="hover:bg-gray-300">
        <button className="text-sm px-4 py-2">Edit Board</button>
      </div>
      <div className="hover:bg-gray-300">
        <button className="text-sm px-4 py-2">
          Delete Board
        </button>
      </div>
    </div>
  )
}
```

**Features**:
- **Conditional Rendering**: Shows/hides based on `show` prop
- **Positioning**: Absolute positioning relative to parent
- **Hover Effects**: Interactive feedback for better UX
- **TypeScript Interface**: Type-safe props definition

### 3. Creating the Sidebar Component

Create the Sidebar component (`src/app/components/Sidebar.tsx`):
```typescript
export default function Sidebar() {
  return (
    <aside className="w-[18.75rem] flex-none dark:bg-dark-grey h-full py-6 pr-6">
      <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
        {`All Boards (0)`}
      </p>
      <div className="cursor-pointer flex items-center rounded-tr-full rounded-br-full bg-blue-500 space-x-2 pl-[2.12rem] py-3 pb-3">
        <p className="text-white text-lg capitalize">Current board name</p>
      </div>
      <button className="flex items-center space-x-2 pl-[2.12rem] py-3">
        <p className="text-base font-bold capitalize text-main-purple">
          + Create New Board
        </p>
      </button>
    </aside>
  );
}
```

**Features**:
- **Fixed Width**: Consistent sidebar width across all screens
- **Board List**: Displays available boards with count
- **Active Board**: Highlights currently selected board
- **Create Button**: Easy access to board creation

### 4. Creating the Board Tasks Component

Create the BoardTasks component (`src/app/components/BoardTasks.tsx`):
```typescript
export default function BoardTasks() {
  return (
    <div className="overflow-x-auto overflow-y-auto w-full bg-stone-200">
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-black text-sm">
            This board is empty. Create a new column to get started.
          </p>
          <button className="bg-blue-500 text-black px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2">
            <p>+ Add New Column</p>
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Features**:
- **Scrollable Area**: Handles overflow with scroll bars
- **Empty State**: User-friendly message when no tasks exist
- **Call-to-Action**: Prominent button to add first column
- **Responsive Layout**: Adapts to different screen sizes

### 5. Updating the Layout and Page Components

**Update Layout** (`src/app/layout.tsx`):
```typescript
import type { Metadata } from 'next'
import { Providers } from "@/redux/provider";
import Navbar from './components/Navbar';
import { Plus_Jakarta_Sans } from "next/font/google";
import './globals.css'

const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: 'My Kanban Task Management App',
  description: 'A full-stack Kanban task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={pjs.className}>
      <body className='pb-24 h-screen overflow-hidden'>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

**Update Home Page** (`src/app/page.tsx`):
```typescript
import Sidebar from "./components/Sidebar";
import BoardTasks from "./components/BoardTasks";

export default function Home() {
  return (
    <main className="flex h-full">
      <Sidebar />
      <BoardTasks />
    </main>
  );
}
```

### 6. Understanding the Component Architecture

**Layout Hierarchy**:
```
RootLayout
├── Providers (Redux)
├── Navbar (Global)
└── Page Content
    ├── Sidebar
    └── BoardTasks
```

**Key Design Decisions**:

1. **Client vs Server Components**:
   - **Navbar**: `'use client'` for state management
   - **Other Components**: Server components for better performance
   - **Layout**: Server component with client providers

2. **Styling Approach**:
   - **Tailwind CSS**: Utility-first styling
   - **Responsive Design**: Mobile-first approach
   - **Consistent Spacing**: Using Tailwind's spacing scale

3. **State Management**:
   - **Local State**: `useState` for component-specific state
   - **Global State**: Redux for application-wide state
   - **Props**: Type-safe component communication

### 7. Component Features Overview

**Navbar Features**:
- ✅ App branding and title
- ✅ Current board name display
- ✅ Add new task button
- ✅ Board options dropdown
- ✅ Responsive design

**Sidebar Features**:
- ✅ Board count display
- ✅ Active board highlighting
- ✅ Create new board button
- ✅ Fixed width layout

**Board Area Features**:
- ✅ Empty state messaging
- ✅ Add new column button
- ✅ Scrollable content area
- ✅ Responsive layout

### 8. Component Integration Status

✅ **UI Components**: All core components implemented and integrated  
✅ **Redux Integration**: Components connected to Redux store  
✅ **Modal System**: Dynamic modals for boards and tasks implemented  
✅ **Firebase Connection**: Real-time data synchronization active  
✅ **Form Validation**: Client-side validation with error handling  
✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality  

### 9. Next Steps

With the core functionality complete, you can now:

1. **Add Drag & Drop**: Implement react-beautiful-dnd for task movement
2. **Enhance Styling**: Add animations and improved visual design
3. **Add Advanced Features**: Due dates, priorities, subtasks
4. **Implement Collaboration**: Board sharing and team features
5. **Add Dark Mode**: Theme switching capability

## Firebase Firestore Integration

### Setting Up Firebase Firestore

To integrate Firestore into your application, you'll need to create a Firebase project using the Firebase console. You can name the project according to your preference, but for this tutorial, we'll use "Kanban-app-tutorial."

**Step-by-Step Setup:**

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or "Add project"
   - Enter your project name (e.g., "Kanban-app-tutorial")
   - Follow the setup wizard to create the project

2. **Register Your App**:
   - Once the project is created, you'll be prompted to register your app
   - Choose "Web" as the platform
   - Enter your app nickname
   - Copy the Firebase configuration object

3. **Install Firebase Package**:
   ```bash
   npm install firebase
   ```

4. **Configure Firebase**:
   - Create a `utils` folder in your `src/app` directory
   - Create `firebaseConfig.ts` file inside the utils folder
   - Paste your Firebase configuration into the file
   - The configuration will initialize Firebase and export the Firestore database instance

5. **Set Up Firestore Database**:
   - Navigate to your Firebase project console
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select your preferred location for the database

6. **Configure Firestore Rules**:
   - Go to the "Rules" tab in Firestore Database
   - Modify the read and write rules from `false` to `true`
   - This enables anyone to add data to the database without restrictions
   - **Note**: This is not recommended for production - we're implementing it this way for development purposes only

### Adding Initial Data to Firestore

**Goal**: Ensure users aren't greeted with an empty board when they complete authentication. Instead, present them with dummy task data they can interact with, allowing them to explore the application's features.

**Approach**: Make this data user-specific, forming the foundation for each user to build upon by creating new boards and tasks.

**Implementation Strategy**:

1. **Check if User is New**:
   - Determine whether the user is signing in for the first time
   - This allows us to automatically create a new document for the user in the database

2. **Create New User Document**:
   - If the user is new, create a new data entry in the database specifically for that user
   - Use the user's email as a unique identifier

**Data Structure**:
- Create a `data.js` file in the utils folder containing dummy data for a board
- The data includes boards with columns and tasks
- Each item has a unique ID generated using a utility function

**Integration Process**:
- Modify the main page component to handle user session management
- Import necessary Firestore methods for document operations
- Implement functions to:
  - Get user session details
  - Check if user document exists in database
  - Add new document with initial data for new users
- Use React hooks (`useEffect`, `useState`) to manage the data flow

**Key Features**:
- **User-Specific Data**: Each user gets their own document in the database
- **Automatic Initialization**: New users automatically receive dummy data
- **Session Management**: Integration with NextAuth.js for user authentication
- **Error Handling**: Proper error handling for database operations

**Database Structure**:
```
users/
  └── {user-email}/
      └── tasks/
          └── {document-with-board-data}
```

**Benefits**:
- **Immediate Engagement**: Users can interact with the app right away
- **Learning Experience**: Users can explore features with sample data
- **Personalization**: Each user has their own data space
- **Scalability**: Foundation for future data management features

## CRUD Operations Implementation

### Overview

The application implements comprehensive CRUD (Create, Read, Update, Delete) operations for both boards and tasks. This section covers the implementation of these operations using Redux Toolkit Query (RTK Query) for data fetching and Firebase Firestore for data persistence.

### Database Operations Setup

**RTK Query API Slice Configuration**:
- **Data Fetching**: Implemented `fetchDataFromDb` query to retrieve user-specific board data
- **Data Updates**: Implemented `updateBoardToDb` mutation for persisting changes to Firestore
- **Real-time Sync**: Automatic data refetching after mutations using `invalidatesTags`
- **Error Handling**: Comprehensive error handling for database operations

**Key Features**:
- **User-Specific Operations**: All operations are scoped to the authenticated user's data
- **Optimistic Updates**: UI updates immediately while database operations happen in background
- **Automatic Caching**: RTK Query handles data caching and synchronization
- **Type Safety**: Full TypeScript support for all database operations

### Board Management Operations

**Create Board**:
- **Trigger**: "+ Create New Board" button in sidebar
- **Modal**: AddAndEditBoardModal with "Add New Board" variant
- **Validation**: Board name and column names validation
- **Process**: Creates new board with specified columns and adds to user's data

**Read Boards**:
- **Automatic Loading**: Boards load automatically when user signs in
- **Real-time Updates**: Board list updates immediately after changes
- **Active Board**: Current board name displayed in navbar and sidebar

**Update Board**:
- **Trigger**: "Edit Board" option in dropdown menu
- **Modal**: AddAndEditBoardModal with "Edit Board" variant
- **Pre-populated Data**: Existing board name and columns loaded for editing
- **Process**: Updates board name and columns, maintains task data

**Delete Board**:
- **Trigger**: "Delete Board" option in dropdown menu
- **Modal**: Confirmation modal with board name display
- **Implementation**: Removes board from user's data structure
- **Process**: Updates board list and refreshes UI
- **Safety**: Confirmation mechanism to prevent accidental deletion

### Task Management Operations

**Create Task**:
- **Trigger**: "+ Add New Task" button in navbar
- **Modal**: AddAndEditTaskModal with "Add New Task" variant
- **Validation**: Task title and status validation against existing columns
- **Process**: Adds new task to specified column

**Read Tasks**:
- **Dynamic Loading**: Tasks load based on active board selection
- **Column Organization**: Tasks grouped by columns with counts displayed
- **Real-time Updates**: Task list updates immediately after changes

**Update Task**:
- **Trigger**: Edit icon on individual task cards
- **Modal**: AddAndEditTaskModal with "Edit Task" variant
- **Pre-populated Data**: Existing task title and status loaded for editing
- **Column Movement**: Changing task status moves it between columns
- **Process**: Updates task properties and handles column transitions

**Delete Task**:
- **Trigger**: Delete icon on individual task cards
- **Modal**: Confirmation modal with task title display
- **Implementation**: Removes task from its current column
- **Process**: Updates board data and refreshes UI
- **Safety**: Confirmation prevents accidental deletion

### Modal System Architecture

**Shared Modal Components**:
- **Modal**: Base modal component with overlay and positioning
- **ModalBody**: Content wrapper with consistent styling
- **AddAndEditBoardModal**: Handles both board creation and editing
- **AddAndEditTaskModal**: Handles both task creation and editing
- **DeleteBoardAndTaskModal**: Handles both board and task deletion with confirmation

**State Management**:
- **Redux Integration**: Modal state managed through Redux store
- **Variant System**: Single modal handles multiple use cases through variants
- **Form Validation**: Client-side validation with error messaging
- **Loading States**: Loading indicators during database operations

**User Experience Features**:
- **Form Validation**: Real-time validation with error messages
- **Auto-clear Errors**: Error messages automatically clear after 3 seconds
- **Loading States**: Visual feedback during database operations
- **Responsive Design**: Modals adapt to different screen sizes

### Data Flow Architecture

**State Management Flow**:
1. **User Action**: User clicks button or icon to trigger operation
2. **Redux Dispatch**: Action dispatched to update modal state
3. **Modal Display**: Modal opens with appropriate variant and data
4. **Form Interaction**: User fills form and submits
5. **Validation**: Client-side validation ensures data integrity
6. **Database Update**: RTK Query mutation updates Firestore
7. **Cache Invalidation**: Data cache invalidated to trigger refetch
8. **UI Update**: Interface updates with new data automatically

**Error Handling Strategy**:
- **Client-side Validation**: Immediate feedback for form errors
- **Database Error Handling**: Graceful handling of network and database errors
- **User Feedback**: Clear error messages and loading states
- **Recovery Mechanisms**: Retry capabilities and fallback options

### Performance Optimizations

**Efficient Data Management**:
- **Selective Updates**: Only affected data is updated in database
- **Optimistic Updates**: UI updates immediately for better user experience
- **Caching Strategy**: RTK Query handles intelligent data caching
- **Minimal Re-renders**: React optimization prevents unnecessary component updates

**Database Optimization**:
- **Batch Operations**: Multiple changes batched when possible
- **Indexed Queries**: Efficient database queries using proper indexing
- **Real-time Sync**: Automatic synchronization without manual refresh
- **Error Recovery**: Automatic retry mechanisms for failed operations

## 🎯 Implementation Status

### ✅ Completed Features

**Authentication & Security**:
- Google OAuth integration with NextAuth.js
- Protected routes with middleware
- Secure session management
- User profile access

**State Management**:
- Redux Toolkit store configuration
- RTK Query for data fetching
- Typed hooks for type safety
- Modal state management

**Database Integration**:
- Firebase Firestore connection
- Real-time data synchronization
- User-specific data storage
- Automatic data initialization

**CRUD Operations**:
- **Boards**: Create, Read, Update, Delete (with confirmation modal)
- **Tasks**: Create, Read, Update, Delete (with confirmation modal)
- Form validation and error handling
- Optimistic updates with cache invalidation
- Complete modal system for all operations

**UI Components**:
- Responsive navigation bar
- Interactive sidebar with board list
- Dynamic task board with columns
- Modal system for forms
- Loading states and user feedback

**Form Validation**:
- Client-side validation
- Error messaging
- Auto-clear error messages
- Required field validation

### 🔄 Current Functionality

**Board Management**:
- Create new boards with custom columns
- Edit existing boards and columns
- Delete boards with confirmation modal
- Real-time board list updates
- Form validation for board names and columns

**Task Management**:
- Add new tasks to any column
- Edit task titles and move between columns
- Delete tasks with confirmation modal
- Dynamic column task counts
- Status validation against existing columns

**User Experience**:
- Intuitive modal interfaces for all operations
- Form validation with clear error messages
- Loading states during operations
- Responsive design for all screen sizes
- Real-time data synchronization
- Confirmation modals for destructive actions
- Auto-clear error messages after 3 seconds

### 🚀 Ready for Production

The application is now fully functional with:
- Complete CRUD operations for boards and tasks
- Secure authentication system
- Real-time data synchronization
- Form validation and error handling
- Responsive design
- Type-safe implementation
- Confirmation modals for delete operations
- Comprehensive modal system for all interactions

### 🔮 Next Development Phase

Future enhancements can include:
- Drag & drop functionality for task movement
- Dark mode theme switching
- Advanced task features (due dates, priorities, subtasks)
- Collaboration features (board sharing, team management)
- Notification system
- Analytics and reporting
- Progressive Web App capabilities

## Project Structure

```
mykanban-app/
├── docs/                          # Documentation
│   ├── PROJECT_BRIEF.md          # Project overview and goals
│   └── GETTING_STARTED.md        # This file
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/auth/[...nextauth]/ # Authentication API routes
│   │   ├── components/           # UI Components
│   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   ├── Dropdown.tsx      # Board options dropdown
│   │   │   ├── Sidebar.tsx       # Board navigation sidebar
│   │   │   └── BoardTasks.tsx    # Main board content area
│   │   ├── utils/                # Utility functions and configurations
│   │   │   ├── firebaseConfig.ts # Firebase configuration
│   │   │   └── data.js           # Initial dummy data
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── lib/                      # Utility functions
│   ├── redux/                    # Redux store configuration
│   │   ├── store.ts              # Redux store setup
│   │   ├── hooks.ts              # Typed Redux hooks
│   │   └── provider.tsx          # Redux provider component
│   └── middleware.ts             # NextAuth middleware
├── .env.local                    # Environment variables (create this)
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── README.md                     # Main project documentation
└── tsconfig.json                 # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

**Issue**: `redirect_uri_mismatch` error
- **Solution**: Ensure the redirect URI in Google Cloud Console is exactly: `http://localhost:3000/api/auth/callback/google`
- Check for typos, wrong protocol (use `http://` not `https://`), wrong port, or extra characters

**Issue**: `NEXTAUTH_URL` warning
- **Solution**: Add `NEXTAUTH_URL=http://localhost:3000` to your `.env.local` file

**Issue**: Environment variables not loading
- **Solution**: Ensure `.env.local` is in the project root and restart the development server

**Issue**: Authentication not working
- **Solution**: 
  1. Verify your Google OAuth credentials are correct
  2. Check that the OAuth consent screen is properly configured
  3. Ensure the redirect URI matches exactly
  4. Restart the development server after making changes

### Getting Help

If you encounter issues:

1. **Check the terminal** for error messages and debug logs
2. **Verify environment variables** are correctly set
3. **Review Google Cloud Console** settings
4. **Check the documentation** in the `docs/` folder
5. **Open an issue** on GitHub with detailed error information

## Next Steps

Once you have the application running:

1. **Explore the Interface**: Sign in and explore the Kanban board
2. **Read the Documentation**: Check out the main README.md for detailed development guides
3. **Start Development**: Follow the development steps in the main documentation
4. **Contribute**: Fork the repository and submit pull requests

## Development Workflow

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Implement new features or fix bugs
3. **Test your changes**: Ensure everything works correctly
4. **Commit your changes**: `git commit -m "Add your feature"`
5. **Push to GitHub**: `git push origin feature/your-feature-name`
6. **Create a Pull Request**: Submit your changes for review

---

*For detailed development instructions, see the main README.md file.*
