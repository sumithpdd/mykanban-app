import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useFetchBoardsQuery } from "@/redux/services/apiSlice";
import { setCurrentBoardName } from "@/redux/features/appSlice";
import { openAddAndEditBoardModal } from "@/redux/features/appSlice";
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  // State to keep track of the index of the active board during navigation
  const [active, setActive] = useState<number>(0);
  const { data: session, status } = useSession();

  const { data: boards } = useFetchBoardsQuery();
  
  // Debug logging
  console.log('🔍 Sidebar - boards:', boards);
  console.log('🔍 Sidebar - boards length:', boards?.length);
  
  const dispatch = useAppDispatch();

  // Function to handle navigation through boards
  const handleNav = (index: number, name: string) => {
    setActive(index);
    dispatch(setCurrentBoardName(name));
  };

  return (
    <aside className="w-[18.75rem] flex-none dark:bg-dark-grey h-full py-6 pr-6">
      {boards && (
        <>
          {/* Display the number of boards available in the data */}
          <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
            {`All Boards (${boards?.length || 0})`}
          </p>
          {/* Display the names of each board */}
          {boards?.map(
            (board: { [key: string]: any }, index: number) => {
              const { name, id } = board;
              const isActive = index === active; // Check if the board is active
              return (
                <div
                  key={id}
                  onClick={() => handleNav(index, name)} // Handle navigation through boards on click
                  className={`${
                    isActive ? 'rounded-tr-full rounded-br-full bg-blue-500 text-white' : 'text-black'
                  } cursor-pointer flex items-center 
                  space-x-2 pl-[2.12rem] py-3 pb-3`}
                >
                  <p className="text-lg capitalize">{name}</p>
                </div>
              );
            }
          )}
        </>
      )}
     {/* trigger the create new board modal */}
     <button
         onClick={() => dispatch(openAddAndEditBoardModal("Add New Board"))}
         className="flex items-center space-x-2 pl-[2.12rem] py-3"
       >
         <p className="text-base font-bold capitalize text-main-purple">
           + Create New Board
         </p>
       </button>
    </aside>
  );
}