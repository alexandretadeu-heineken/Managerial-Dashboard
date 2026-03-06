'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function ChangePasswordForm({ onSuccess, onBack }: ChangePasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword && currentPassword) {
      setSubmitted(true);
      setTimeout(onSuccess, 2000);
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
          <CheckCircle2 className="h-8 w-8 text-h-green" />
        </div>
        <h2 className="text-2xl font-bold text-h-text-dark mb-2">Senha alterada!</h2>
        <p className="text-h-text-muted text-sm mb-4">
          Sua senha foi atualizada com sucesso. Redirecionando...
        </p>
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
        Voltar
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-h-text-dark">Trocar Senha</h1>
        <p className="text-h-text-muted text-sm mt-1">
          Mantenha sua conta segura atualizando sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider mb-2">
            Senha Atual
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-h-gray-bg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider mb-2">
            Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-h-gray-bg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-h-text-dark transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider mb-2">
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-h-gray-bg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={newPassword !== confirmPassword || !newPassword}
          className="w-full bg-h-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atualizar Senha
        </button>
      </form>
    </motion.div>
  );
}
