'use client';

import { Menu, X, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/70 h-20 flex items-center">
      <div className="container mx-auto px-6 flex items-center justify-between w-full max-w-7xl">
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-extrabold font-display text-lg shadow-sm">
            HF
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-black tracking-tight leading-none">
              HOMEFIX
            </span>
            <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
              Fixing Homes, Improving Lives
            </span>
          </div>
        </a>

        <button className="md:hidden text-black p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent flex-col md:flex-row items-center gap-8 p-6 md:p-0 shadow-xl md:shadow-none border-b-2 border-black md:border-none transition-all ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          <ul className="flex flex-col md:flex-row gap-6 font-semibold text-sm text-slate-600">
            <li><a href="#services" className="hover:text-black transition-colors">Services</a></li>
            <li><a href="#why-us" className="hover:text-black transition-colors">Why HomeFix</a></li>
            <li><a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a></li>
            <li><a href="#coverage" className="hover:text-black transition-colors">Areas Covered</a></li>
          </ul>
          
          <a 
            href="#get-app"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Smartphone size={16} /> Get The App
          </a>
        </nav>
      </div>
    </header>
  );
}
