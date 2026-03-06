'use client';

import React from 'react';
import { Star, Calendar, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-h-dark-green text-white px-6 md:px-10 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Star className="h-8 w-8 text-white fill-current" />
          <div className="h-6 w-[1px] bg-white/20 mx-2 hidden sm:block"></div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight leading-none uppercase">Executive Dashboard</h1>
            <p className="text-[10px] opacity-60 font-medium tracking-widest uppercase mt-0.5">Financial Operations</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 cursor-pointer hover:bg-white/10 transition-colors">
          <Calendar className="h-[18px] w-[18px] opacity-70" />
          <span className="text-xs font-medium">Jan 2024 - Jun 2024</span>
          <ChevronDown className="h-[18px] w-[18px] opacity-40 ml-1" />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden xs:block">
            <p className="text-xs font-semibold leading-tight">Diretoria Financeira</p>
            <p className="text-[10px] opacity-60">Status: Sincronizado</p>
          </div>
          <div className="h-9 w-9 bg-h-green rounded-full border border-white/20 overflow-hidden relative">
            <Image
              alt="Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRqjwOsgPxXNfXfr7sUtYJOy2Wkr8xpvnTLAIRs24CBOGhdUm5lqwlIG9g70vulGr4Io4R70V_kpuKtVS4oNrOuqR1DYazoumT9XXBcMz3C4Kkl3giHJ5PIukN_8YH8wdO4M6J6RhWAlqt-HMhx714yqJq9IvvrRZXVKUHoP4cHwIez50PnRL9faNycTuNI27K3lIj3bX1J3_Xgiabzkt8KsWPejozJWgw5Me4paew1e-dzhAjn2rQ-GxjKvyApA3IRmHnQwQJ3aHk"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
