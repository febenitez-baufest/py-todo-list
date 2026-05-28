import type { Todo, TodoCreate, TodoUpdate } from '../types/todo';

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000') + '/todos';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function fetchTodos(completed?: boolean): Promise<Todo[]> {
  const url = new URL(BASE_URL + '/');
  if (completed !== undefined) url.searchParams.set('completed', String(completed));
  const res = await fetch(url.toString());
  return handleResponse<Todo[]>(res);
}

export async function fetchTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<Todo>(res);
}

export async function createTodo(data: TodoCreate): Promise<Todo> {
  const res = await fetch(BASE_URL + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodo(id: number, data: TodoUpdate): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
