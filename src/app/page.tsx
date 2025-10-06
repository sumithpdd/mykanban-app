"use client";
import Sidebar from "./components/Sidebar";
import BoardTasks from "./components/BoardTasks";
import AddAndEditBoardModal from "./components/AddAndEditBoardModal";
import AddAndEditTaskModal from "./components/AddAndEditTaskModal";
import DeleteBoardAndTaskModal from "./components/DeleteBoardAndTaskModal";
import TagManagementModal from "./components/TagManagementModal";
import { useAppSelector } from "@/redux/hooks";
import { getTagManagementModalValue } from "@/redux/features/appSlice";

export default function Home() {
  const isTagManagementModalOpen = useAppSelector(getTagManagementModalValue);

  return (
    <main className="flex h-full">
      <Sidebar />
      <BoardTasks />
      <AddAndEditBoardModal />
      <AddAndEditTaskModal/> 
      <DeleteBoardAndTaskModal/>
      <TagManagementModal isOpen={isTagManagementModalOpen} />
    </main>
  );
}