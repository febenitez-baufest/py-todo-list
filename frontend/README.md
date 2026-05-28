# TODO List — Frontend

SPA desarrollada con **React + Vite + TypeScript + Tailwind CSS + TanStack Query** que consume la API REST del backend Python/FastAPI.

## Tecnologías

| Tecnología | Motivo |
|---|---|
| React + Vite | SPA moderna, setup mínimo, build rápido |
| TypeScript | Tipado estático que refleja los schemas Pydantic del backend |
| Tailwind CSS | Estilos utility-first sin overhead de componentes pesados |
| TanStack Query | Cache/loading/error automático para llamadas a la API |
| fetch nativo | La API es simple (5 endpoints), sin dependencias extra |

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:8000` (ver `../README.md`)

## Instalación

```bash
cd frontend
cp .env.example .env      # ajustar VITE_API_URL si el backend corre en otro puerto
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | URL base del backend |

## Estructura

```
src/
├── api/
│   └── todos.ts          # Funciones fetch hacia la REST API
├── components/
│   ├── FilterBar.tsx     # Filtro: todas / pendientes / completadas
│   ├── TodoForm.tsx      # Formulario para crear tareas
│   ├── TodoItem.tsx      # Ítem con checkbox, edición inline y eliminar
│   └── TodoList.tsx      # Lista con estados de carga y error
├── types/
│   └── todo.ts           # Interfaces TypeScript (TodoCreate, TodoUpdate, TodoResponse)
├── App.tsx
└── main.tsx
```

## Funcionalidades

- ✅ Listar todas las tareas
- ✅ Crear tarea (título + descripción opcional)
- ✅ Marcar/desmarcar como completada
- ✅ Edición inline de título y descripción
- ✅ Eliminar tarea
- ✅ Filtrar: todas / pendientes / completadas
- ✅ Feedback de carga y errores
- ✅ Diseño responsive con soporte dark mode
