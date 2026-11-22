import React, { useState } from 'react';

export const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-indigo-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">FILA ZERO</h1>
        
        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <a href="/dashboard" className="hover:text-indigo-200 font-medium transition">Dashboard</a>
          <a href="/agendamento" className="hover:text-indigo-200 font-medium transition">Novo Agendamento</a>
          <a href="/meus-agendamentos" className="hover:text-indigo-200 font-medium transition">Meus Agendamentos</a>
          <a href="/" className="hover:text-red-300 font-medium transition">Sair</a>
        </nav>

        {/* Botão de Menu Mobile */}
        <button 
          onClick={() => setMenuAberto(!menuAberto)} 
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Dropdown Mobile */}
      {menuAberto && (
        <div className="md:hidden bg-indigo-800 px-4 pt-2 pb-4 space-y-2">
          <a href="/dashboard" className="block text-white py-1">Dashboard</a>
          <a href="/agendamento" className="block text-white py-1">Novo Agendamento</a>
          <a href="/meus-agendamentos" className="block text-white py-1">Meus Agendamentos</a>
          <a href="/" className="block text-red-300 py-1">Sair</a>
        </div>
      )}
    </header>
  );
};