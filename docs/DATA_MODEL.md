# Data Model

We use three top-level collections: `users`, `tags`, `boards`.

## users
```
{
  id: string,
  email: string,
  name: string,
  avatar?: string,
  createdAt: string,
  updatedAt: string
}
```

## tags
```
{
  id: string,
  name: string,
  color: string,
  description?: string,
  createdAt: string,
  updatedAt: string
}
```

## boards
```
{
  id: string,
  ownerId: string, // user email
  name: string,
  description?: string,
  columns: Column[],
  createdAt: string,
  updatedAt: string
}
```

### Column
```
{
  id: string,
  name: string,
  tasks: Task[]
}
```

### Task
```
{
  id: string,
  title: string,
  description: string, // HTML
  status: string,      // matches a column name
  order: number,       // 0-based position in column
  tags: string[],      // Tag IDs
  assignedTo: string[],// User IDs
  dueDate?: string,
  createdAt: string,
  createdBy?: string,
  updatedAt: string,
  updatedBy?: string,
  completedDate?: string,
  timeSpent: number,   // minutes
  timeEstimate?: number,// minutes
  notes?: string,
  checklistItems?: ChecklistItem[]
}
```

### ChecklistItem
```
{
  id: string,
  text: string,
  completed: boolean,
  createdAt: string,
  updatedAt: string
}
```

Notes
- Keep relations by ID (emails or generated IDs)
- Client converts time fields to hours for input; stored as minutes
- `description` is sanitized on render with DOMPurify
