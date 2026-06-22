import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 text-zinc-500 dark:text-zinc-400 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        placeholder="Search products…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-full glass-card
          text-zinc-800 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40
          focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 shadow-sm"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            ref.current?.focus();
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
