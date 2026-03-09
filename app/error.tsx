'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-h-gray-bg p-6 text-center">
      <h2 className="text-2xl font-black text-h-red mb-4">Algo deu errado!</h2>
      <button
        onClick={() => reset()}
        className="bg-h-green text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
      >
        Tentar novamente
      </button>
    </div>
  );
}
