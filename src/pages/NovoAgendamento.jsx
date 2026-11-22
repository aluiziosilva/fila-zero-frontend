import React, { useState } from "react";
import { 
  Home, 
  ArrowLeft, 
  CalendarCheck, 
  Building2, 
  Calendar, 
  Clock, 
  ClipboardList, 
  CheckCircle2 
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function NovoAgendamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Captura se é um reagendamento de um item específico
  const reaganId = searchParams.get("reagendarId");

  // Estados dos seletores
  const [unidade, setUnidade] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const unidades = [
    "UBS - SOCORRO DO PIAUÍ",
    "POSTO DE SAÚDE - CENTRO",
    "CENTRO DE ESPECIALIDADES - ZONA SUL"
  ];

  const horariosDisponiveis = [
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00"
  ];

  const handleConfirmar = (e) => {
    e.preventDefault();

    if (!unidade || !data || !horario) {
      alert("Por favor, preencha todos os campos antes de confirmar!");
      return;
    }

    const session = JSON.parse(localStorage.getItem("@filazero:session") || "{}");
    const agendamentosExistentes = JSON.parse(
      localStorage.getItem("@filazero:agendamentos") || "[]"
    );

    const [ano, mes, dia] = data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    let listaAtualizada = [];

    if (reaganId) {
      // SE FOR REAGENDAMENTO: Atualiza o registro existente no mesmo ID
      listaAtualizada = agendamentosExistentes.map((item) => {
        if (item.id === reaganId) {
          return {
            ...item,
            servico: unidade,
            data: dataFormatada,
            horario,
            status: "REAGENDADO"
          };
        }
        return item;
      });
      alert("Agendamento reagendado com sucesso!");
    } else {
      // SE FOR NOVO AGENDAMENTO: Cria um novo registro
      const novoRegistro = {
        id: String(Date.now()),
        usuarioId: session.id || "1",
        servico: unidade,
        data: dataFormatada,
        horario,
        status: "CONFIRMADO",
        protocolo: `PROT-${Date.now().toString().slice(-6)}`
      };
      listaAtualizada = [...agendamentosExistentes, novoRegistro];
      alert("Agendamento realizado com sucesso!");
    }

    localStorage.setItem("@filazero:agendamentos", JSON.stringify(listaAtualizada));
    navigate("/meus-agendamentos");
  };

  const dataExibicao = data 
    ? data.split("-").reverse().join("/") 
    : "DD/MM/AAAA";

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-4 md:p-8">
      <div className="w-full flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between">
        
        <div>
          {/* Cabeçalho */}
          <div className="w-full flex justify-between items-center pb-6 border-b border-slate-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-3 text-blue-900 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 font-semibold"
              title="Voltar ao Início"
            >
              <Home size={28} />
              <span className="hidden sm:inline">Início</span>
            </button>

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wider">
                FILA ZERO
              </h1>
              <p className="text-xs md:text-sm font-semibold text-blue-800 uppercase tracking-wide mt-1">
                Portal de Agendamento de Serviços Públicos Online
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="p-3 text-blue-900 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 font-semibold"
              title="Voltar"
            >
              <span className="hidden sm:inline">Voltar</span>
              <ArrowLeft size={28} />
            </button>
          </div>

          {/* Título da Seção */}
          <div className="flex items-center justify-center gap-3 my-8">
            <CalendarCheck size={36} className="text-blue-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase">
              {reaganId ? "Reagendar Atendimento" : "Novo Agendamento"}
            </h2>
          </div>

          <form onSubmit={handleConfirmar} className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Selecionar Unidade */}
              <div className="bg-blue-900 text-white rounded-2xl p-5 flex flex-col items-center justify-between shadow-lg min-h-[160px]">
                <label htmlFor="select-unidade" className="text-sm font-bold text-center uppercase tracking-wider mb-2">
                  SELECIONE A UNIDADE DE ATENDIMENTO
                </label>
                <Building2 size={44} className="my-2" />
                <select
                  id="select-unidade"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full bg-blue-950 text-white font-semibold text-center py-2 px-3 rounded-xl border border-blue-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {unidades.map((u, i) => (
                    <option key={i} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Selecionar Data */}
              <div className="bg-blue-900 text-white rounded-2xl p-5 flex flex-col items-center justify-between shadow-lg min-h-[160px]">
                <label htmlFor="input-data" className="text-sm font-bold text-center uppercase tracking-wider mb-2">
                  SELECIONE A DATA DE ATENDIMENTO
                </label>
                <Calendar size={44} className="my-2" />
                <input
                  id="input-data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full bg-blue-950 text-white font-semibold text-center py-2 px-3 rounded-xl border border-blue-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                />
              </div>

              {/* Selecionar Horário */}
              <div className="bg-blue-900 text-white rounded-2xl p-5 flex flex-col items-center justify-between shadow-lg min-h-[160px]">
                <label htmlFor="select-horario" className="text-sm font-bold text-center uppercase tracking-wider mb-2">
                  SELECIONE O HORÁRIO DE ATENDIMENTO
                </label>
                <Clock size={44} className="my-2" />
                <select
                  id="select-horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full bg-blue-950 text-white font-semibold text-center py-2 px-3 rounded-xl border border-blue-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {horariosDisponiveis.map((h, i) => (
                    <option key={i} value={h}>{h}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Resumo */}
            <div className="w-full bg-blue-900 text-white rounded-2xl p-5 flex items-center justify-center gap-4 shadow-lg">
              <ClipboardList size={32} className="hidden sm:block" />
              <p className="text-lg md:text-xl font-bold uppercase tracking-wide text-center">
                {unidade || "UNIDADE"} - {dataExibicao} - {horario || "HORÁRIO"}
              </p>
            </div>

            {/* Botão Confirmar */}
            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-2xl text-center uppercase tracking-wider text-xl transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <CheckCircle2 size={26} /> {reaganId ? "Confirmar Reagendamento" : "Confirmar"}
            </button>

          </form>
        </div>

        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium mt-8">
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público • Desenvolvido pelo <strong className="text-slate-700">Grupo 2</strong>
        </div>

      </div>
    </div>
  );
}

export default NovoAgendamento;