import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-5 glass-card rounded-3xl max-w-lg mx-auto shadow-xl">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-inner">
        <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <div>
        <p className="text-zinc-900 dark:text-zinc-50 font-bold text-xl">Oops! Something went wrong</p>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-sm mx-auto">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
