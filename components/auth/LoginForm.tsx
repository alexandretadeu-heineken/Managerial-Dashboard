'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLogin: (email: string) => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onLogin, onForgotPassword }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="bg-h-dark-green p-3 rounded-xl mb-4">
          <Star className="h-8 w-8 text-white fill-current" />
        </div>
        <h1 className="text-2xl font-bold text-h-text-dark">Bem-vindo de volta</h1>
        <p className="text-h-text-muted text-sm mt-1">Acesse D&T AMS Dashboards</p>
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
              placeholder="seu.email@heineken.com.br"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider">
              Senha
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-bold text-h-green hover:text-h-dark-green transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <button
          type="submit"
          className="w-full bg-h-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
        >
          Entrar no Dashboard
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-h-text-muted">
          Problemas com o acesso? <a href="https://nextgen.service-now.com/esc_it" target="_blank" rel="noopener noreferrer" className="text-h-green font-bold hover:underline">Suporte D&T</a>
        </p>
      </div>
    </motion.div>
  );
}
