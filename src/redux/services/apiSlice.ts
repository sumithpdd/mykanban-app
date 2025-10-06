import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  setDoc, 
  addDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";

// Utility function to clean undefined values from objects
const cleanData = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  if (Array.isArray(data)) {
    return data.map(cleanData);
  }
  
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );
};

// Utility function to generate unique IDs
const generateUniqueId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Define interfaces for the new schema
export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  order: number; // Order within the column (0-based index)
  tags: string[]; // Array of tag IDs
  assignedTo: string[]; // Array of user IDs
  dueDate?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string; // user email or id
  completedDate?: string; // Auto-filled when moved to last column
  timeSpent: number;
  timeEstimate?: number;
  checklistItems?: IChecklistItem[]; // Array of checklist items
  notes?: string; // plain text short notes
}

export interface IColumn {
  id: string;
  name: string;
  tasks: ITask[];
}

export interface IBoard {
  id: string;
  name: string;
  description?: string;
  columns: IColumn[];
  ownerId: string; // User ID who owns this board
  createdAt: string;
  updatedAt: string;
}

export const fireStoreApi = createApi({
  reducerPath: "firestoreApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Users", "Boards", "Tasks", "Tags"],
endpoints: (builder) => ({
    // Users endpoints
    fetchUsers: builder.query<IUser[], void>({
   async queryFn() {
        try {
          const ref = collection(db, "users");
          const querySnapshot = await getDocs(ref);
          return { data: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IUser)) };
        } catch (e) {
          return { error: e };
        }
      },
      providesTags: ["Users"],
    }),

    // Get or create current user
    getCurrentUser: builder.query<IUser, void>({
      async queryFn() {
     try {
       const session = await getSession();
          if (!session?.user?.email) {
            return { error: "No session" };
          }

                  if (process.env.NODE_ENV !== 'production') console.log('🔍 getCurrentUser - checking for user:', session.user.email);
          
          // Check if user exists
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", session.user.email));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.docs.length > 0) {
            // User exists
            const userData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as IUser;
                    if (process.env.NODE_ENV !== 'production') console.log('✅ getCurrentUser - user exists:', userData);
            return { data: userData };
          } else {
            // User doesn't exist, create them
                    if (process.env.NODE_ENV !== 'production') console.log('🆕 getCurrentUser - creating new user for:', session.user.email);
            const now = new Date().toISOString();
            const userRef = await addDoc(collection(db, "users"), {
              email: session.user.email,
              name: session.user.name || session.user.email.split('@')[0],
              avatar: session.user.image,
              createdAt: now,
              updatedAt: now,
            });
            
            const newUser = {
              id: userRef.id,
              email: session.user.email,
              name: session.user.name || session.user.email.split('@')[0],
              avatar: session.user.image,
              createdAt: now,
              updatedAt: now,
            } as IUser;
            
                    if (process.env.NODE_ENV !== 'production') console.log('✅ getCurrentUser - created new user:', newUser);
            return { data: newUser };
          }
        } catch (e) {
          console.error('❌ getCurrentUser - error:', e);
          return { error: e };
        }
      },
      providesTags: ["Users"],
    }),

    createUser: builder.mutation({
      async queryFn(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
          const now = new Date().toISOString();
          const userRef = await addDoc(collection(db, "users"), {
            ...userData,
            createdAt: now,
            updatedAt: now,
          });
          return { data: { id: userRef.id } };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      async queryFn({ userId, userData }: { userId: string; userData: Partial<IUser> }) {
        try {
          await updateDoc(doc(db, "users", userId), {
            ...userData,
            updatedAt: new Date().toISOString(),
          });
          return { data: null };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Users"],
    }),

    // Tags endpoints
    fetchTags: builder.query<ITag[], void>({
      async queryFn() {
        try {
          const ref = collection(db, "tags");
         const querySnapshot = await getDocs(ref);
          return { data: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ITag)) };
        } catch (e) {
          return { error: e };
        }
      },
      providesTags: ["Tags"],
    }),

    createTag: builder.mutation({
      async queryFn(tagData: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
          const now = new Date().toISOString();
          const tagRef = await addDoc(collection(db, "tags"), {
            ...tagData,
            createdAt: now,
            updatedAt: now,
          });
          return { data: { id: tagRef.id } };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Tags"],
    }),

    updateTag: builder.mutation({
      async queryFn({ tagId, tagData }: { tagId: string; tagData: Partial<ITag> }) {
        try {
          await updateDoc(doc(db, "tags", tagId), {
            ...tagData,
            updatedAt: new Date().toISOString(),
          });
          return { data: null };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Tags"],
    }),

    deleteTag: builder.mutation({
      async queryFn(tagId: string) {
        try {
          await deleteDoc(doc(db, "tags", tagId));
          return { data: null };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Tags"],
    }),

    // Boards endpoints
    fetchBoards: builder.query<IBoard[], void>({
      async queryFn() {
        try {
          const session = await getSession();
                  if (process.env.NODE_ENV !== 'production') console.log('🔍 fetchBoards -', new Date().toISOString(), '- session:', session);
          
          if (!session?.user?.email) {
                    if (process.env.NODE_ENV !== 'production') console.log('❌ fetchBoards -', new Date().toISOString(), '- no session, returning empty array');
            return { data: [] };
          }
          
                  if (process.env.NODE_ENV !== 'production') console.log('🔍 fetchBoards -', new Date().toISOString(), '- user email:', session.user.email);
          const ref = collection(db, "boards");
          const q = query(ref, where("ownerId", "==", session.user.email));
          const querySnapshot = await getDocs(q);
          const boards = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IBoard));
                  if (process.env.NODE_ENV !== 'production') console.log('✅ fetchBoards -', new Date().toISOString(), '- found boards:', boards);
          return { data: boards };
        } catch (e) {
          console.error('❌ fetchBoards -', new Date().toISOString(), '- error:', e);
          return { error: e };
        }
      },
      providesTags: ["Boards"],
    }),

    createBoard: builder.mutation({
      async queryFn(boardData: Omit<IBoard, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
          const session = await getSession();
          if (!session?.user?.email) return { error: "No user session" };
          
          const now = new Date().toISOString();
          const boardRef = await addDoc(collection(db, "boards"), {
            ...boardData,
            ownerId: session.user.email,
            createdAt: now,
            updatedAt: now,
          });
          return { data: { id: boardRef.id } };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Boards"],
    }),

    updateBoard: builder.mutation({
      async queryFn({ boardId, boardData }: { boardId: string; boardData: Partial<IBoard> }) {
        try {
          // Clean undefined values
          const cleanBoardData = cleanData(boardData);
          
                  if (process.env.NODE_ENV !== 'production') console.log('🔍 updateBoard - cleaning data:', { boardId, originalData: boardData, cleanData: cleanBoardData });
          
          await updateDoc(doc(db, "boards", boardId), {
            ...cleanBoardData,
            updatedAt: new Date().toISOString(),
          });
          return { data: null };
        } catch (e) {
          console.error('❌ updateBoard - error:', e);
          return { error: e };
        }
      },
      invalidatesTags: ["Boards"],
    }),

    deleteBoard: builder.mutation({
      async queryFn(boardId: string) {
        try {
          await deleteDoc(doc(db, "boards", boardId));
          return { data: null };
     } catch (e) {
       return { error: e };
     }
   },
      invalidatesTags: ["Boards"],
    }),

    // Tasks endpoints
    addTask: builder.mutation({
      async queryFn({ boardId, columnId, taskData }: { boardId: string; columnId: string; taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'> }) {
        try {
          const boardRef = doc(db, "boards", boardId);
          const boardDoc = await getDocs(query(collection(db, "boards"), where("__name__", "==", boardId)));
          
          if (boardDoc.empty) return { error: "Board not found" };
          
          const boardData = boardDoc.docs[0].data() as IBoard;
          const column = boardData.columns.find(col => col.id === columnId);
          
          if (!column) return { error: "Column not found" };
          
          const now = new Date().toISOString();
          const sessionForCreate = await getSession();
          const newTask: ITask = {
            ...taskData,
            id: generateUniqueId('task-'),
            order: column.tasks.length, // Add to end of column
            createdAt: now,
            createdBy: sessionForCreate?.user?.email || undefined,
            updatedAt: now,
            updatedBy: sessionForCreate?.user?.email || undefined,
          };
          
          const updatedColumns = boardData.columns.map(col => {
            if (col.id === columnId) {
              return { ...col, tasks: [...col.tasks, newTask] };
            }
            return col;
          });

          await updateDoc(boardRef, { 
            columns: updatedColumns, 
            updatedAt: now 
          });
          return { data: null };
        } catch (e) {
          console.error('❌ addTask - error:', e);
          return { error: e };
        }
      },
      invalidatesTags: ["Boards"],
    }),

    updateTask: builder.mutation({
      async queryFn({ 
        boardId, 
        columnId, 
        taskId, 
        taskData 
      }: { 
        boardId: string; 
        columnId: string; 
        taskId: string; 
        taskData: Partial<ITask> 
      }) {
        try {
          // Clean undefined values from taskData
          const cleanTaskData = cleanData(taskData);
          
          if (process.env.NODE_ENV !== 'production') console.log('🔍 updateTask - cleaning data:', { boardId, columnId, taskId, originalData: taskData, cleanData: cleanTaskData });
          
          const boardRef = doc(db, "boards", boardId);
          const boardDoc = await getDocs(query(collection(db, "boards"), where("__name__", "==", boardId)));
          
          if (boardDoc.empty) return { error: "Board not found" };
          
          const boardData = boardDoc.docs[0].data() as IBoard;
          const sessionForUpdate = await getSession();
          const updatedColumns = boardData.columns.map(col => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: col.tasks.map(task => 
                  task.id === taskId 
                    ? { 
                        ...task, 
                        ...cleanTaskData, 
                        updatedAt: new Date().toISOString(),
                        updatedBy: sessionForUpdate?.user?.email || task.updatedBy
                      }
                    : task
                )
              };
            }
            return col;
          });

          await updateDoc(boardRef, {
            columns: updatedColumns,
            updatedAt: new Date().toISOString(),
          });
          
          return { data: null };
        } catch (e) {
          console.error('❌ updateTask - error:', e);
          return { error: e };
        }
      },
      invalidatesTags: ["Boards"],
    }),

    moveTask: builder.mutation({
      async queryFn({ 
        boardId, 
        sourceColumnId, 
        destinationColumnId, 
        taskId, 
        newPosition,
        isLastColumn = false
      }: { 
        boardId: string; 
        sourceColumnId: string; 
        destinationColumnId: string; 
        taskId: string; 
        newPosition: number;
        isLastColumn?: boolean;
      }) {
        try {
          const boardRef = doc(db, "boards", boardId);
          const boardDoc = await getDocs(query(collection(db, "boards"), where("__name__", "==", boardId)));
          
          if (boardDoc.empty) return { error: "Board not found" };
          
          const boardData = boardDoc.docs[0].data() as IBoard;
          const sourceColumn = boardData.columns.find(col => col.id === sourceColumnId);
          const destinationColumn = boardData.columns.find(col => col.id === destinationColumnId);
          
          if (!sourceColumn || !destinationColumn) return { error: "Column not found" };
          
          const task = sourceColumn.tasks.find(t => t.id === taskId);
          if (!task) return { error: "Task not found" };
          
          // Remove from source column
          const updatedSourceTasks = sourceColumn.tasks.filter(t => t.id !== taskId);
          
          // Add to destination column with proper ordering
          const updatedDestinationTasks = [...destinationColumn.tasks];
          const updatedTask = {
            ...task,
            status: destinationColumn.name,
            order: newPosition, // Set the order based on drop position
            updatedAt: new Date().toISOString(),
            ...(isLastColumn && { completedDate: new Date().toISOString() }),
          };
          
          // Insert at the correct position
          updatedDestinationTasks.splice(newPosition, 0, updatedTask);
          
          // Reorder all tasks in destination column to maintain proper order indices
          const reorderedDestinationTasks = updatedDestinationTasks.map((task, index) => ({
            ...task,
            order: index
          }));
          
          const updatedColumns = boardData.columns.map(col => {
            if (col.id === sourceColumnId) {
              // Reorder remaining tasks in source column
              const reorderedSourceTasks = updatedSourceTasks.map((task, index) => ({
                ...task,
                order: index
              }));
              return { ...col, tasks: reorderedSourceTasks };
            } else if (col.id === destinationColumnId) {
              return { ...col, tasks: reorderedDestinationTasks };
            }
            return col;
          });

          // Clean the data before saving to Firebase
          const cleanColumns = cleanData(updatedColumns);
          
          if (process.env.NODE_ENV !== 'production') console.log('🔍 moveTask - cleaning data:', { 
            boardId, 
            sourceColumnId, 
            destinationColumnId, 
            taskId, 
            originalColumns: updatedColumns, 
            cleanColumns 
          });

          await updateDoc(boardRef, {
            columns: cleanColumns,
            updatedAt: new Date().toISOString(),
          });
          
          return { data: null };
        } catch (e) {
          console.error('❌ moveTask - error:', e);
          return { error: e };
        }
      },
      invalidatesTags: ["Boards"],
 }),
}),
});

// Export hooks for using the created endpoints
export const { 
  useFetchUsersQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useFetchTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useFetchBoardsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
} = fireStoreApi;