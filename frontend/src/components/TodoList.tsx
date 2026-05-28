import { useQuery } from '@tanstack/react-query';
import { fetchTodos } from '../api/todos';
import TodoItem from './TodoItem';
import type { FilterType } from '../types/todo';

interface TodoListProps {
  filter: FilterType;
}

export default function TodoList({ filter }: TodoListProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetchTodos(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm gap-2">
        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        Cargando tareas…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
        ⚠️ Error al cargar las tareas: {(error as Error).message}
      </div>
    );
  }

  const todos = data ?? [];
  const filtered = todos.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm gap-2">
        <svg viewBox="0 0 48 48" className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="8" y="8" width="32" height="36" rx="3" />
          <path d="M16 20h16M16 28h10" />
        </svg>
        {filter === 'all' ? 'No hay tareas todavía.' : `No hay tareas ${filter === 'pending' ? 'pendientes' : 'completadas'}.`}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {filtered.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
