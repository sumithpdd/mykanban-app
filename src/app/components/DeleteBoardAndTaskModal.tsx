import { Modal, ModalBody } from "./Modal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
closeDeleteBoardAndTaskModal,
getDeleteBoardAndTaskModalValue,
getDeleteBoardAndTaskModalVariantValue,
getDeleteBoardAndTaskModalTitle,
getDeleteBoardAndTaskModalIndex,
getDeleteBoardAndTaskModalStatus,
getCurrentBoardName,
} from "@/redux/features/appSlice";
import {
useFetchBoardsQuery,
  useUpdateBoardMutation,
} from "@/redux/services/apiSlice";

export default function DeleteBoardAndTaskModal() {
  //variable declarations, functions, JSX
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getDeleteBoardAndTaskModalValue);
  const closeModal = () => dispatch(closeDeleteBoardAndTaskModal());
  const currentBoardName = useAppSelector(getCurrentBoardName);
  const modalVariant = useAppSelector(getDeleteBoardAndTaskModalVariantValue);
  const taskTitle = useAppSelector(getDeleteBoardAndTaskModalTitle);
  const taskIndex = useAppSelector(getDeleteBoardAndTaskModalIndex);
  const taskStatus = useAppSelector(getDeleteBoardAndTaskModalStatus);
  let { data: boards } = useFetchBoardsQuery();
  const [updateBoard, { isLoading }] = useUpdateBoardMutation();

  const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (boards) {
      if (modalVariant === "Delete this board?") {
        // Implement the logic for deleting the board
        if (currentBoardName) {
          //  Find and delete the board
          const boardToDelete = boards.find(
            (board: { name: string }) => board.name === currentBoardName
          );
          if (boardToDelete) {
            // Use deleteBoard mutation here when implemented
            // For now, we'll skip this as we don't have deleteBoard mutation exposed
            console.log("Delete board:", boardToDelete.id);
          }
        }
      } else {
        // Implement the logic for deleting a task
        if (taskIndex !== undefined && taskStatus && currentBoardName) {
          //  Handle the logic to update the tasks
          const activeBoard = boards.find(
            (board: { name: string }) => board.name === currentBoardName
          );
          
          if (activeBoard) {
            const updatedColumns = activeBoard.columns.map((column: any) => {
              if (column.name === taskStatus) {
                const updatedTasks = column.tasks.filter(
                  (_: any, index: number) => index !== taskIndex
                );
                return { ...column, tasks: updatedTasks };
              }
              return column;
            });
            
            updateBoard({
              boardId: activeBoard.id,
              boardData: { columns: updatedColumns as any }
            });
            closeModal();
          }
        }
      }
    }
   };

   return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="text-red font-bold text-lg">{modalVariant}</p>
        <div className="pt-6">
          <p className="text-sm text-medium-grey leading-6">
            {modalVariant === "Delete this board?"
              ? `Are you sure you want to delete the '${currentBoardName}' board? This action will remove all columns
                and tasks and cannot be reversed.`
              : `Are you sure you want to delete the '${taskTitle}' tasks? This action cannot be reversed.`}
          </p>
        </div>
        <div className="pt-6 flex space-x-2">
          <div className="w-1/2">
            <button
              type="submit"
              onClick={(e: React.FormEvent<HTMLButtonElement>) =>
                handleDelete(e)
              }
              className="bg-red-500 rounded-3xl py-2 w-full text-sm font-bold"
            >
              {" "}
              {isLoading ? "Loading" : "Delete"}
            </button>
          </div>
          <div className="w-1/2">
            <button
              onClick={closeModal}
              className="bg-stone-200 rounded-3xl py-2 w-full text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
   );
   }