interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = 'Cargando...'
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent
                      rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
    </div>
  );
}