import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <NavButton
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </NavButton>

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 text-sm"
          >
            …
          </span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPageChange(p as number)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300
              ${
                p === page
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
                  : 'glass-card text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50'
              }`}
          >
            {p}
          </motion.button>
        )
      )}

      <NavButton
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </NavButton>

      <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  'aria-label': string;
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-10 h-10 rounded-full flex items-center justify-center
        glass-card text-zinc-500 dark:text-zinc-400 transition-all duration-300
        disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500 dark:disabled:hover:text-zinc-400"
    >
      {children}
    </motion.button>
  );
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];
  if (current > 3) pages.push('…');

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('…');
  pages.push(total);

  return pages;
}
