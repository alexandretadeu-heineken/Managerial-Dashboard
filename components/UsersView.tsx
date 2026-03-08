'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { User, Edit2, Trash2, Plus, Loader2, Shield, Mail, Check, X, AlertCircle, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  updated_at: string;
}

interface UsersViewProps {
  currentUserRole: string;
}

export function UsersView({ currentUserRole }: UsersViewProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', role: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: '', email: '', password: '', role: 'user' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [isAdminFromList, setIsAdminFromList] = useState(false);
  const effectiveIsAdmin = (currentUserRole?.toLowerCase() === 'admin') || isAdminFromList;

  const fetchUsers = React.useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('full_name');
    if (error) {
      console.error('Error fetching users:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      if (error.code === '42P01') {
        setMessage({ 
          text: 'A tabela "profiles" não foi encontrada. Certifique-se de executar as migrations no Supabase SQL Editor.', 
          type: 'error' 
        });
      } else {
        setMessage({ 
          text: 'Erro ao carregar usuários: ' + error.message, 
          type: 'error' 
        });
      }
    } else {
      const fetchedUsers = data || [];
      setUsers(fetchedUsers);
      
      // Fallback: Se o cargo passado por prop for 'user', mas na lista este usuário for 'admin',
      // podemos confiar na lista que acabou de vir do banco.
      const { data: { session } } = await supabase.auth.getSession();
      const currentProfile = fetchedUsers.find(u => u.id === session?.user?.id);
      if (currentProfile?.role?.toLowerCase() === 'admin') {
        setIsAdminFromList(true);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: Profile) => {
    setIsEditing(user.id);
    setEditForm({ full_name: user.full_name || '', role: user.role || 'user' });
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: editForm.full_name, 
        role: editForm.role, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      setMessage({ text: 'Erro ao atualizar usuário: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'Usuário atualizado com sucesso!', type: 'success' });
      setIsEditing(null);
      fetchUsers();
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este usuário?')) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      setMessage({ text: 'Erro ao remover usuário: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'Usuário removido com sucesso!', type: 'success' });
      fetchUsers();
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.email || !addForm.password || !addForm.full_name) {
      setMessage({ text: 'Por favor, preencha todos os campos.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Create a temporary client to sign up without logging out the admin
      const tempSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
      );

      // 2. Sign up the user
      const { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email: addForm.email,
        password: addForm.password,
        options: {
          data: {
            full_name: addForm.full_name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 3. Update the profile with the correct role
        // The trigger usually creates the profile, but we want to ensure the role is correct
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: addForm.role, 
            full_name: addForm.full_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);

        if (profileError) {
          // If update fails, maybe the profile wasn't created yet by the trigger?
          // Let's try to upsert instead
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: addForm.email,
              full_name: addForm.full_name,
              role: addForm.role,
              updated_at: new Date().toISOString()
            });
          
          if (upsertError) throw upsertError;
        }

        setMessage({ text: 'Usuário criado com sucesso!', type: 'success' });
        setIsAdding(false);
        setAddForm({ full_name: '', email: '', password: '', role: 'user' });
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      setMessage({ text: 'Erro ao criar usuário: ' + (error.message || 'Erro desconhecido'), type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-h-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-h-text-dark tracking-tight">Gestão de Usuários</h2>
          <p className="text-h-text-muted text-sm mt-1">Visualize e gerencie as permissões de acesso</p>
        </div>
        {effectiveIsAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-h-green text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
          >
            <Plus size={16} />
            ADICIONAR USUÁRIO
          </button>
        )}
      </div>

      {!effectiveIsAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Acesso Restrito</p>
            <p>Você está logado com o cargo: <span className="font-mono font-bold underline px-1 bg-amber-100 rounded">{currentUserRole}</span>. Apenas Administradores podem realizar alterações.</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-h-gray-bg/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Cargo</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-h-text-muted text-sm">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-h-gray-bg/20 transition-colors">
                    <td className="px-6 py-4">
                      {isEditing === user.id ? (
                        <input 
                          type="text" 
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-h-green/20 focus:border-h-green outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-h-gray-bg flex items-center justify-center text-[10px] font-bold text-h-green border border-gray-100 uppercase">
                            {user.full_name?.slice(0, 2) || '??'}
                          </div>
                          <span className="text-sm font-bold text-h-text-dark">{user.full_name || 'Sem nome'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-h-text-muted">
                        <Mail size={14} />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing === user.id ? (
                        <select 
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-h-green/20 focus:border-h-green outline-none bg-white"
                        >
                          <option value="user">Usuário</option>
                          <option value="admin">Administrador</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-h-green/10 text-h-green' : 'bg-gray-100 text-h-text-muted'
                        }`}>
                          <Shield size={10} />
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {effectiveIsAdmin && (
                        <div className="flex items-center gap-2">
                          {isEditing === user.id ? (
                            <>
                              <button 
                                onClick={() => handleUpdate(user.id)}
                                className="p-2 text-h-green hover:bg-h-green/5 rounded-lg transition-colors"
                                title="Salvar"
                              >
                                <Check size={18} />
                              </button>
                              <button 
                                onClick={() => setIsEditing(null)}
                                className="p-2 text-h-text-muted hover:bg-gray-100 rounded-lg transition-colors"
                                title="Cancelar"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleEdit(user)}
                                className="p-2 text-h-text-muted hover:bg-h-gray-bg rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-h-red hover:bg-h-red/5 rounded-lg transition-colors"
                                title="Remover"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-h-text-dark">Adicionar Usuário</h3>
              <button onClick={() => setIsAdding(false)} className="text-h-text-muted hover:text-h-text-dark transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-h-text-muted uppercase tracking-widest mb-1.5">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-h-text-muted" size={16} />
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: João Silva"
                    value={addForm.full_name}
                    onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-h-green/20 focus:border-h-green outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-h-text-muted uppercase tracking-widest mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-h-text-muted" size={16} />
                  <input 
                    type="email" 
                    required
                    placeholder="email@exemplo.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-h-green/20 focus:border-h-green outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-h-text-muted uppercase tracking-widest mb-1.5">Senha Inicial</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-h-text-muted" size={16} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-h-green/20 focus:border-h-green outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-h-text-muted uppercase tracking-widest mb-1.5">Cargo</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-h-text-muted" size={16} />
                  <select 
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-h-green/20 focus:border-h-green outline-none transition-all bg-white appearance-none"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-h-green text-white py-3 rounded-xl font-bold hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      CRIANDO...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      CRIAR USUÁRIO
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
