import type { FilterType } from '../types/todo';

interface FilterBarProps {
  filter: FilterType;
  onChange: (f: FilterType) => void;
  total: number;
  pending: number;
  completed: number;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' },
];

export default function FilterBar({ filter, onChange, total, pending, completed }: FilterBarProps) {
  const counts: Record<FilterType, number> = { all: total, pending, completed };

  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {label}
          <span
            className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${
              filter === value ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
            }`}
          >
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}
