import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo } from '../api/todos';
import type { TodoCreate } from '../types/todo';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: TodoCreate) => createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
      setDescription('');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ title: title.trim(), description: description.trim() || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-3">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Nueva tarea</h2>
      <input
        type="text"
        placeholder="Título *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <input
        type="text"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {mutation.isError && (
        <p className="text-red-500 text-xs">{(mutation.error as Error).message}</p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending || !title.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        {mutation.isPending ? 'Creando…' : 'Agregar tarea'}
      </button>
    </form>
  );
}
