'use client';

import React, { useState } from 'react';
import { Star, LogOut, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onLogout: () => void;
  onChangePassword: () => void;
  userName: string;
  userEmail: string;
}

export function Header({ onLogout, onChangePassword, userName, userEmail }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-h-dark-green text-white px-6 md:px-10 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Star className="h-8 w-8 text-white fill-current shrink-0" />
          <div className="h-6 w-[1px] bg-white/20 mx-2 hidden sm:block"></div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-bold tracking-tight leading-none uppercase">Managerial Dashboard</h1>
            <p className="text-[9px] md:text-[10px] opacity-60 font-medium tracking-widest uppercase mt-0.5 hidden sm:block">D&T AMS BR - Support Functions</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4 relative">
          <div className="text-right">
            <p className="text-xs font-semibold leading-tight">{userName}</p>
            <p className="text-[10px] opacity-60 hidden sm:block">{userEmail}</p>
          </div>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-9 w-9 bg-h-green rounded-full border border-white/20 flex items-center justify-center relative cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
          >
            <span className="text-xs font-bold uppercase">
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20"
                >
                  <button
                    onClick={() => {
                      onChangePassword();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-h-text-dark hover:bg-h-gray-bg flex items-center gap-2 transition-colors"
                  >
                    <Key className="h-4 w-4 text-h-text-muted" />
                    Trocar Senha
                  </button>
                  <div className="h-[1px] bg-gray-100 my-1" />
                  <button
                    onClick={() => {
                      onLogout();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-h-red hover:bg-h-red/5 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Off
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
