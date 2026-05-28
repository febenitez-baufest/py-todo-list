import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTodo, deleteTodo } from '../api/todos';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description ?? '');
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTodo>[1]) => updateTodo(todo.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  function handleToggle() {
    updateMutation.mutate({ completed: !todo.completed });
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateMutation.mutate(
      { title: editTitle.trim(), description: editDesc.trim() || undefined },
      { onSuccess: () => setEditing(false) },
    );
  }

  function handleCancelEdit() {
    setEditTitle(todo.title);
    setEditDesc(todo.description ?? '');
    setEditing(false);
  }

  return (
    <li className="bg-white dark:bg-gray-800 rounded-xl shadow px-4 py-3 flex gap-3 items-start">
      <button
        onClick={handleToggle}
        disabled={updateMutation.isPending}
        aria-label={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-500 hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1,6 4,10 11,2" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-2">
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {updateMutation.isError && (
              <p className="text-red-500 text-xs">{(updateMutation.error as Error).message}</p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded px-3 py-1 text-xs font-medium"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded px-3 py-1 text-xs font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <p
              className={`text-sm font-medium break-words ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'
              }`}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">{todo.description}</p>
            )}
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
              {new Date(todo.created_at).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </>
        )}
      </div>

      {!editing && (
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            aria-label="Editar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" />
            </svg>
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            aria-label="Eliminar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}
