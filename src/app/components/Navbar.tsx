'use client' 

   import Dropdown from "./Dropdown";
   import { useState, useEffect } from 'react'
   // Import Redux functions and selectors for managing board names
   import { setCurrentBoardName, getCurrentBoardName, openAddAndEditTaskModal } from '@/redux/features/appSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
// Import the data-fetching hook from the API slice
import { useFetchBoardsQuery } from "@/redux/services/apiSlice";
import { useSession } from 'next-auth/react';
import { openTagManagementModal } from '@/redux/features/appSlice';

   export default function Navbar() {
    const [show, setShow] = useState<boolean>(false);
    const { data: session, status } = useSession();
    
   // Destructuring assignment to extract data from the useFetchBoardsQuery hook
   const { data: boards, isLoading, error } = useFetchBoardsQuery();
   
   // Access the Redux dispatch function for calling actions
   const dispatch = useAppDispatch();

   // Effect hook to run when the data updates
   useEffect(() => {
    console.log('🔍 Navbar - boards:', boards);
    console.log('🔍 Navbar - boards length:', boards?.length);
    
    if (boards && boards.length > 0) {
      // When a user signs in, set the currentBoardName to the first board's name
      const activeBoard = boards[0];
      console.log('🔍 Navbar - setting active board:', activeBoard.name);
      dispatch(setCurrentBoardName(activeBoard.name));
    }
   }, [boards]);

   // Select the current board name from the Redux store
   const currentBoardName = useAppSelector(getCurrentBoardName);

   return (
    <nav className="bg-white border flex h-24">
      <div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
        <p className="font-bold text-3xl"> Kanban App </p>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-between px-6">
        {/* Board Name */}
        <div className="flex items-center">
          <p className="text-black text-2xl font-bold">{currentBoardName}</p>
        </div>
        
        {/* Right Side - Login Info and Actions */}
        <div className="flex items-center space-x-4">
          {/* Login Information */}
          {session ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {status === 'loading' ? 'Loading...' : 'Not signed in'}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {session && (
              <>
                <button 
                 type='button'
                 onClick={() => dispatch(openAddAndEditTaskModal({variant: 'Add New Task'}))}
                 className="bg-blue-500 text-white px-4 py-2 flex rounded-3xl items-center space-x-2">
                     <p>+ Add New Task</p>
                </button>
                <button 
                 type='button'
                 onClick={() => dispatch(openTagManagementModal())}
                 className="bg-green-500 text-white px-4 py-2 flex rounded-3xl items-center space-x-2">
                     <p>🏷️ Manage Tags</p>
                </button>
              </>
            )}
            
            <div className="relative flex items-center">
              <button onClick={() => setShow(!show)} className="text-3xl mb-4">
                ...
              </button>
              <Dropdown show={show} />
            </div>
            
            {/* Sign In/Out */}
            {session ? (
              <a 
                href="/api/auth/signout" 
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Sign Out
              </a>
            ) : (
              <a 
                href="/api/auth/signin" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
   );
   }