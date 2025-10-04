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

## Project Structure

```
mykanban-app/
├── docs/                          # Documentation
│   ├── PROJECT_BRIEF.md          # Project overview and goals
│   └── GETTING_STARTED.md        # This file
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/auth/[...nextauth]/ # Authentication API routes
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # React components
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
