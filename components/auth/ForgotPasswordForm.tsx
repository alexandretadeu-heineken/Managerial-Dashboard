'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center"
      >
        <div className="bg-h-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="h-8 w-8 text-h-green" />
        </div>
        <h2 className="text-2xl font-bold text-h-text-dark mb-2">E-mail enviado!</h2>
        <p className="text-h-text-muted text-sm mb-8">
          Enviamos as instruções de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada.
        </p>
        <button
          onClick={onBack}
          className="w-full bg-h-gray-bg text-h-text-dark py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
        >
          Voltar para o Login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-h-text-muted hover:text-h-text-dark transition-colors mb-6 text-sm font-bold"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Login
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-h-text-dark">Recuperar senha</h1>
        <p className="text-h-text-muted text-sm mt-1">
          Informe seu e-mail corporativo para receber as instruções.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider mb-2">
            E-mail Corporativo
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-h-gray-bg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all"
              placeholder="seu.nome@heineken.com"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-h-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
        >
          Enviar Instruções
        </button>
      </form>
    </motion.div>
  );
}
