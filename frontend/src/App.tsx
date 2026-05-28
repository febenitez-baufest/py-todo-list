import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTodos } from './api/todos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import type { FilterType } from './types/todo';

export default function App() {
  const [filter, setFilter] = useState<FilterType>('all');

  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetchTodos(),
  });

  const todos = data ?? [];
  const pending = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            ✅ TODO List
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestioná tus tareas diarias
          </p>
        </header>

        <TodoForm />

        <div className="flex flex-col gap-3">
          <FilterBar
            filter={filter}
            onChange={setFilter}
            total={todos.length}
            pending={pending}
            completed={completed}
          />
          <TodoList filter={filter} />
        </div>
      </div>
    </div>
  );
}
