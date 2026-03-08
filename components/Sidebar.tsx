'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, activeItem, onItemClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Managerial Dashboard', icon: LayoutDashboard },
    { id: 'managerial-jobs', label: 'Managerial JOBs', icon: Briefcase },
    { id: 'users', label: 'Usuários', icon: Users },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="bg-white border-r border-gray-200 h-screen sticky top-0 z-40 flex flex-col transition-all duration-300 shadow-sm"
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-black text-h-green tracking-[0.2em] uppercase"
          >
            Menu
          </motion.span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg text-h-text-muted transition-colors ml-auto"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-h-green text-white shadow-lg shadow-h-green/20' 
                  : 'text-h-text-muted hover:bg-h-gray-bg hover:text-h-text-dark'
              }`}
            >
              <Icon size={22} className={isActive ? 'text-white' : 'group-hover:text-h-green transition-colors'} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-bold whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-h-dark-green text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-8 w-8 rounded-full bg-h-gray-bg flex items-center justify-center text-[10px] font-bold text-h-green border border-gray-200">
            HE
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-h-text-dark truncate">Heineken BR</p>
              <p className="text-[10px] text-h-text-muted truncate">D&T Support</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
