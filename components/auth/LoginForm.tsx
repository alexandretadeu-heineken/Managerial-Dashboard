'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

interface LoginFormProps {
  onLogin: (email: string) => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onLogin, onForgotPassword }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
            }
          }
        });
        if (signUpError) throw signUpError;
        setMessage('Conta criada com sucesso! Verifique seu e-mail ou tente fazer login.');
        setIsSignUp(false);
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          if (authError.message === 'Invalid login credentials') {
            throw new Error('E-mail ou senha incorretos. Se você ainda não tem uma conta, clique em "Criar nova conta" abaixo.');
          }
          throw authError;
        }

        if (data.user) {
          onLogin(data.user.email || email);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold text-h-text-dark">
          {isSignUp ? 'Criar nova conta' : 'Bem-vindo de volta'}
        </h1>
        <p className="text-h-text-muted text-sm mt-1">
          {isSignUp ? 'Cadastre-se para acessar o dashboard' : 'Acesse D&T AMS Dashboards'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-xl">
            {message}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider mb-2">
            E-mail Corporativo
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-h-gray-bg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all disabled:opacity-50"
              placeholder="seu.email@heineken.com.br"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-xs font-bold text-h-text-dark uppercase tracking-wider">
              Senha
            </label>
            {!isSignUp && (
              <button
                type="button"
                disabled={isLoading}
                onClick={onForgotPassword}
                className="text-xs font-bold text-h-green hover:text-h-dark-green transition-colors disabled:opacity-50"
              >
                Esqueceu a senha?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-h-gray-bg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-h-text-dark transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-h-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {isSignUp ? 'Criar Conta' : 'Entrar no Dashboard'}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-xs font-bold text-h-text-muted hover:text-h-green transition-colors"
          >
            {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Criar nova conta'}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-h-text-muted">
          Problemas com o acesso? <a href="https://nextgen.service-now.com/esc_it" target="_blank" rel="noopener noreferrer" className="text-h-green font-bold hover:underline">Suporte D&T</a>
        </p>
      </div>
    </motion.div>
  );
}
