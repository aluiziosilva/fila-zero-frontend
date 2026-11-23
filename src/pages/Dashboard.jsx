import React from "react";
import {
  Settings,
  LogOut,
  CalendarCheck,
  CalendarDays,
  BarChart3,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { obterUsuarioLogado, limparSessao } from "../services/api";

export function Dashboard() {
  const navigate = useNavigate();
  const usuario = obterUsuarioLogado();
  const nomeExibicao = usuario?.nome || usuario?.nomeCompleto || "";

  function handleLogout() {
    limparSessao();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Cabeçalho */}
      <div className="p-6 relative">
        <div className="absolute top-6 right-6 flex items-center gap-4 text-blue-900">
          <button
            onClick={() => navigate("/relatorios")}
            className="hover:text-blue-700 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase"
            title="Relatórios Gerenciais"
          >
            <BarChart3 size={26} />
            <span className="hidden sm:inline">Relatórios</span>
          </button>
          <button
            onClick={() => navigate("/configuracoes")}
            className="hover:text-blue-700 transition-colors"
            title="Configurações"
          >
            <Settings size={28} />
          </button>
          <button
            onClick={handleLogout}
            className="hover:text-red-600 transition-colors"
            title="Sair"
          >
            <LogOut size={28} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
            FILA ZERO
          </h1>
          <p className="text-xs mt-1 text-blue-900 font-medium tracking-wide">
            PORTAL DE AGENDAMENTO DE SERVIÇOS PÚBLICOS ONLINE
          </p>
        </div>
      </div>

      {/* Saudação */}
      <div className="px-12 py-4">
        <div className="flex items-center gap-2 text-blue-900">
          <User size={28} className="shrink-0" />
          <h2 className="text-2xl font-bold">
            Olá, {nomeExibicao ? nomeExibicao.split(" ")[0].toUpperCase() : "USUÁRIO"}!
          </h2>
        </div>
      </div>

      {/* Área dos Botões Principais */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-8 pb-12">
        {/* Botão Novo Agendamento */}
        <button
          onClick={() => navigate("/agendamento")}
          className="w-full max-w-sm h-64 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center gap-6 transition-all transform hover:scale-105 cursor-pointer"
        >
          <span className="text-xl font-bold underline decoration-2 underline-offset-4">
            NOVO AGENDAMENTO
          </span>
          <CalendarCheck size={90} strokeWidth={1.5} className="text-white" />
        </button>

        {/* Botão Meus Agendamentos */}
        <button
          onClick={() => navigate("/meus-agendamentos")}
          className="w-full max-w-sm h-64 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center gap-6 transition-all transform hover:scale-105 cursor-pointer"
        >
          <span className="text-xl font-bold underline decoration-2 underline-offset-4">
            MEUS AGENDAMENTOS
          </span>
          <CalendarDays size={90} strokeWidth={1.5} className="text-white" />
        </button>
      </div>

      {/* Rodapé Formal */}
      <footer className="w-full py-4 text-center border-t border-slate-100 text-xs text-slate-500">
        <p>
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público •
          Desenvolvido pelo{" "}
          <span className="font-semibold text-blue-900">Grupo 2</span>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;