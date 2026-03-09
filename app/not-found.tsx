import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-h-gray-bg p-6 text-center">
      <h2 className="text-4xl font-black text-h-green mb-4">404</h2>
      <p className="text-h-text-dark font-bold mb-6">Página não encontrada</p>
      <Link 
        href="/"
        className="bg-h-green text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
      >
        Voltar para o Dashboard
      </Link>
    </div>
  );
}
