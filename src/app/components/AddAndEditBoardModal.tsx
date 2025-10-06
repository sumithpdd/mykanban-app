import { useState, useEffect } from "react";
import { Modal, ModalBody } from "./Modal";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { id } from '../utils/id';
//import needed functions from the appSlice
import {
  getAddAndEditBoardModalValue,
  getAddAndEditBoardModalVariantValue,
  closeAddAndEditBoardModal,
  getCurrentBoardName,
} from "@/redux/features/appSlice";
import {
  useFetchBoardsQuery,
  useUpdateBoardMutation,
  useCreateBoardMutation,
  useFetchUsersQuery,
} from "@/redux/services/apiSlice";
import { useSession } from 'next-auth/react';

import { FaTimes } from "react-icons/fa";

// define types for boarddata
interface IBoardData {
  id: string,
  name: string;
  columns: {
    id: string;
    name: string;
    columns?: { name: string; tasks?: { [key: string]: any }[] };
  }[];
}
// dummy add board data for the "Add board" modal
let addBoardData = {
  id: id(),
  name: "",
  columns: [
    {
      id: id(),
      name: "",
      tasks:
 [],
    },
  ],};

export default function AddAndEditBoardModal() {

//manage the board data state
const [boardData, setBoardData] = useState<IBoardData>();
// check if the board name field is empty
const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false);
// will be used to check if any of the board column field is empty
const [emptyColumnIndex, setEmptyColumnIndex] = useState<number>();

// get the variant of the modal
const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue);
// check the type of the open modal, whether Add new board, or Edit board
const isVariantAdd = modalVariant === "Add New Board";
const dispatch = useAppDispatch();
// opens that modal if isOpen evaluates to true
const isOpen = useAppSelector(getAddAndEditBoardModalValue);
const currentBoardTitle = useAppSelector(getCurrentBoardName);
// close the modal
const closeModal = () => dispatch(closeAddAndEditBoardModal());
// Fetch data from the database to populate the edit board modal
let { data: boards } = useFetchBoardsQuery();
// Mutation hook for updating the board in the database
const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation();
const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation();
const isLoading = isUpdating || isCreating;
// Owners/Members inputs
const [ownersInput, setOwnersInput] = useState<string>("");
const [membersInput, setMembersInput] = useState<string>("");
const [ownersSet, setOwnersSet] = useState<Set<string>>(new Set());
const [membersSet, setMembersSet] = useState<Set<string>>(new Set());
const { data: users = [] } = useFetchUsersQuery();
const { data: session } = useSession();

 // Effect to set initial data for the modal based on the variant
 useEffect(() => {
  if (boards) {

    if (isVariantAdd) {
      setBoardData(addBoardData);
      setOwnersInput("");
      setMembersInput("");
      setOwnersSet(new Set());
      setMembersSet(new Set());
    } else {
      const activeBoard = boards.find(
        (board: { name: string }) => board.name === currentBoardTitle
      );
      setBoardData(activeBoard);
      if (activeBoard) {
        // @ts-ignore
        setOwnersInput(((activeBoard.owners) || []).join(", "));
        // @ts-ignore
        setMembersInput(((activeBoard.members) || []).join(", "));
        // initialize sets
        // @ts-ignore
        setOwnersSet(new Set((activeBoard.owners) || []));
        // @ts-ignore
        setMembersSet(new Set((activeBoard.members) || []));
      }
    }
  }
}, [boards, modalVariant]);

// Effect to clear error messages after a certain time
useEffect(() => {
  const timeoutId = setTimeout(() => {
    setIsBoardNameEmpty(false);
    setEmptyColumnIndex(undefined);
  }, 3000);
  return () => clearTimeout(timeoutId);
}, [emptyColumnIndex, isBoardNameEmpty]);

// Handler for board name change
const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (boardData) {
    const newName = { ...boardData, name: e.target.value };
    setBoardData(newName);
  }
};

// Handler for column name change. These kind of functions are called closures

const handleColumnNameChange = (index: number) => {
  return function (e: React.ChangeEvent<HTMLInputElement>) {
    // handle change for create new board modal
    if (boardData) {
      const modifyColumns = boardData.columns.map((column, columnIndex) => {
        if (columnIndex === index) {
          return { ...column, name: e.target.value };
        }
        return column;
      });
      const modifiedColumn = { ...boardData, columns: modifyColumns };
      setBoardData(modifiedColumn);
    }
  };
};

// Handler for adding a new column to the form
const handleAddNewColumn = () => {
  // max columns we want to have in a board is 7
  if (boardData && boardData.columns.length < 6) {
    // Make a copy of the existing boardData
    const updatedBoardData = { ...boardData };
    // Create a new column object
    const newColumn = { id: id(), name: "", tasks: [] };
    // Push the new column to the columns array in the copy
    updatedBoardData.columns = [...updatedBoardData.columns, newColumn];
    // Update the state with the modified copy
    setBoardData(updatedBoardData);
  }
};

// Handler for deleting a column in the form
const handleDeleteColumn = (index: number) => {
  if (boardData) {
    const filteredColumns = boardData.columns.filter(
      (_column, columnIndex) => columnIndex !== index
    );
    setBoardData({ ...boardData, columns: filteredColumns });
  }
};

// Handler for adding a new board to the database
const handleAddNewBoardToDb = (e: React.FormEvent<HTMLButtonElement>) => {
  e.preventDefault();

  // check if any of the column names are empty before submiting
  const emptyColumnStringChecker = boardData?.columns.some(
    (column) => column.name === ""
  ); 

  //condition to run if the board name is empty
  if (boardData?.name === "") {
    setIsBoardNameEmpty(true);
  }

  //if any of the column names is empty, update the emptyColumnIndex with its index
  if (emptyColumnStringChecker) {
    const emptyColumn = boardData?.columns.findIndex(
      (column) => column.name == ""
    );
    setEmptyColumnIndex(emptyColumn);
  }

  if (boardData?.name !== "" && !emptyColumnStringChecker && boardData) {
    //submit to the database after verifying that the board name and none of the column names aren't empty
    if (boards) {
      const owners = ownersSet.size > 0 ? Array.from(ownersSet) : ownersInput.split(',').map(s => s.trim()).filter(Boolean);
      const members = membersSet.size > 0 ? Array.from(membersSet) : membersInput.split(',').map(s => s.trim()).filter(Boolean);
      createBoard({
        name: boardData.name,
        description: "",
        columns: boardData.columns as any,
        owners,
        members,
        ownerId: "", // set in API
      } as any);
      closeModal();
    }
  }
};

// Handler for editing a board in the database
const handleEditBoardToDb = (e: React.FormEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const emptyColumnStringChecker = boardData?.columns.some(
    (column) => column.name === ""
  );
  //condition to run if the board name is empty
  if (boardData?.name === "") {
    setIsBoardNameEmpty(true);
  }
  //if any of the column names is empty, update the emptyColumnIndex with its index
  if (emptyColumnStringChecker) {
    const emptyColumn = boardData?.columns.findIndex(
      (column) => column.name == ""
    );
    setEmptyColumnIndex(emptyColumn);
  }
  //submit to the database after verifying that the board name and none of the column names aren't empty
  if (boardData?.name !== "" && !emptyColumnStringChecker && boardData) {
    if (boards) {
      const activeBoard = boards.find(
        (board: { name: string }) => board.name === currentBoardTitle
      );
      if (activeBoard) {
        const owners = ownersSet.size > 0 ? Array.from(ownersSet) : ownersInput.split(',').map(s => s.trim()).filter(Boolean);
        const members = membersSet.size > 0 ? Array.from(membersSet) : membersInput.split(',').map(s => s.trim()).filter(Boolean);
        updateBoard({
          boardId: activeBoard.id,
          boardData: {
            name: boardData.name,
            columns: boardData.columns as any,
            owners,
            members,
          }
        });
        closeModal();
      }
    }
  }
};
return (
  <Modal isOpen={isOpen} onRequestClose={closeModal}>
    <ModalBody>
      {boardData && (
        <>
          {/* display the variant(title) of the modal */}
          <p className="text-lg font-bold">{modalVariant}</p>
          <div className="py-6">
            <div>
              <label htmlFor="boardName" className="text-sm">
                Board Name
              </label>
              <div className="pt-2">
                <input
                  id="boardName"
                  className={`${
                    isBoardNameEmpty ? "border-red-500" : "border-stone-200"
                  } border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
                  placeholder="Name"
                  value={boardData.name}
                  onChange={handleBoardNameChange}
                />
              </div>
              {/* display this error if the board name is empty */}
              {isBoardNameEmpty ? (
                <p className="text-xs text-red-500">
                  Board name cannot be empty
                </p>
              ) : (
                ""
              )}
            </div>

            {/* Owners & Members */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm">Owners (emails)</label>
                <div className="pt-2">
                  <input
                    className="border border-stone-200 focus:outline-none text-sm cursor-pointer w-full p-2 rounded"
                    placeholder="owner1@example.com, owner2@example.com"
                    value={ownersInput}
                    onChange={(e) => setOwnersInput(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Creator is added automatically.</p>
                {/* User list selection */}
                <div className="mt-2 max-h-40 overflow-auto border border-stone-200 rounded p-2">
                  {users.map((u: any) => {
                    const checked = ownersSet.has(u.email);
                    return (
                      <label key={u.id} className="flex items-center gap-2 text-sm py-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const set = new Set(ownersSet);
                            if (e.target.checked) set.add(u.email); else set.delete(u.email);
                            setOwnersSet(set);
                          }}
                        />
                        <span>{u.name || u.email} <span className="text-xs text-gray-500">({u.email})</span></span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm">Members (emails)</label>
                <div className="pt-2">
                  <input
                    className="border border-stone-200 focus:outline-none text-sm cursor-pointer w-full p-2 rounded"
                    placeholder="member1@example.com, member2@example.com"
                    value={membersInput}
                    onChange={(e) => setMembersInput(e.target.value)}
                  />
                </div>
                <div className="mt-2 max-h-40 overflow-auto border border-stone-200 rounded p-2">
                  {users.map((u: any) => {
                    const checked = membersSet.has(u.email);
                    return (
                      <label key={u.id} className="flex items-center gap-2 text-sm py-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const set = new Set(membersSet);
                            if (e.target.checked) set.add(u.email); else set.delete(u.email);
                            setMembersSet(set);
                          }}
                        />
                        <span>{u.name || u.email} <span className="text-xs text-gray-500">({u.email})</span></span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="" className="text-sm">
                Board Column
              </label>
              {boardData &&
                boardData.columns.map(
                  (column: { name: string, id: string }, index: number) => {
                    let { name, id } = column;
                    return (
                      <div key={id} className="pt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            className={`${
                              emptyColumnIndex === index
                                ? "border-red-500"
                                : "border-stone-200"
                            } border border-stone-200 focus:outline-none text-sm cursor-pointer w-full p-2 rounded`}
                            placeholder="e.g Doing"
                            onChange={(e) => handleColumnNameChange(index)(e)}
                            value={name!}
                          />
                          <div>
                            <FaTimes
                              onClick={() => handleDeleteColumn(index)}
                            />
                          </div>
                        </div>
                        {/* display this error if the board name is empty */}
                        {emptyColumnIndex === index ? (
                          <p className="text-xs text-red-500">
                            Column name cannot be empty
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  }
                )}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleAddNewColumn}
                  className="bg-stone-200 rounded-3xl py-2 w-full text-sm font-bold"
                >
                  <p>+ Add New Column</p>
                </button>
              </div>
            </div>
            <div className="pt-6">
              <button
                type="submit"
                onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                  // function to run depending on the variant of the modals
                  const canEdit = !boards ? false : (() => {
                    const active = boards.find((b: any) => b.name === currentBoardTitle);
                    if (!active || isVariantAdd) return true;
                    const email = session?.user?.email;
                    return email && (active.ownerId === email || (active.owners || []).includes(email));
                  })();
                  if (!canEdit) return;
                  isVariantAdd ? handleAddNewBoardToDb(e) : handleEditBoardToDb(e);
                }}
                className={`rounded-3xl py-2 w-full text-sm font-bold ${(() => {
                  const active = boards?.find((b: any) => b.name === currentBoardTitle);
                  const email = session?.user?.email;
                  const canEdit = isVariantAdd || (active && email && (active.ownerId === email || (active.owners || []).includes(email)));
                  return canEdit ? 'bg-blue-500' : 'bg-stone-300 cursor-not-allowed';
                })()}`}
              >
                {/* text to display depending on the variant of the modal */}
                <p>
                  {isLoading
                    ? "Loading"
                    : `${isVariantAdd ? "Create New Board" : "Save Changes"}`}
                </p>
              </button>
              {(!isVariantAdd && boards) && (() => {
                const active = boards.find((b: any) => b.name === currentBoardTitle);
                const email = session?.user?.email;
                const canEdit = active && email && (active.ownerId === email || (active.owners || []).includes(email));
                return !canEdit ? <p className="text-xs text-red-500 mt-2">Only an owner can edit or delete this board.</p> : null;
              })()}
            </div>
          </div>
        </>
      )}
    </ModalBody>
  </Modal>
);
}