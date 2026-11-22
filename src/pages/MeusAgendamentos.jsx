import React, { useState, useEffect } from "react";
import { 
  Home, 
  ArrowLeft, 
  Calendar, 
  RotateCcw, 
  XCircle, 
  FileText 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MeusAgendamentos() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const salvos = JSON.parse(
      localStorage.getItem("@filazero:agendamentos") || "[]"
    );
    // Inverte a lista para que o último agendamento (mais recente) apareça no TOPO
    setAgendamentos([...salvos].reverse());
  }, []);

  const handleCancelar = (id) => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      const salvos = JSON.parse(
        localStorage.getItem("@filazero:agendamentos") || "[]"
      );
      const novaLista = salvos.filter((item) => item.id !== id);
      
      localStorage.setItem("@filazero:agendamentos", JSON.stringify(novaLista));
      setAgendamentos([...novaLista].reverse());
    }
  };

  const handleReagendar = (id) => {
    // Redireciona passando o ID do agendamento que será substituído
    navigate(`/agendamento?reagendarId=${id}`);
  };

  const handleGerarComprovante = (item) => {
    alert(`Gerando comprovante para o protocolo: ${item.protocolo || "PROT-EXEMPLO"}`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-4 md:p-8">
      <div className="w-full flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between">
        
        <div>
          {/* Cabeçalho */}
          <div className="w-full flex justify-between items-center pb-6 border-b border-slate-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-3 text-blue-900 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 font-semibold"
              title="Início"
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

          {/* Título */}
          <div className="flex items-center justify-center gap-3 my-8">
            <Calendar size={36} className="text-blue-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase">
              Meus Agendamentos
            </h2>
          </div>

          {/* Lista de Agendamentos */}
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 my-6">
            {agendamentos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-lg">Você ainda não possui nenhum agendamento registrado.</p>
                <button
                  onClick={() => navigate("/agendamento")}
                  className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Criar Agendamento
                </button>
              </div>
            ) : (
              agendamentos.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="bg-blue-900 text-white rounded-2xl p-4 md:p-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shadow-md">
                    <button
                      onClick={() => handleReagendar(item.id)}
                      className="flex items-center gap-2 hover:text-blue-200 transition-colors text-xs md:text-sm font-bold uppercase"
                      title="Reagendar"
                    >
                      <RotateCcw size={20} />
                      <span>Reagendar</span>
                    </button>

                    <div className="text-center font-bold text-base md:text-lg tracking-wide flex-1">
                      {item.servico} - {item.data} - {item.horario}
                    </div>

                    <button
                      onClick={() => handleCancelar(item.id)}
                      className="flex items-center gap-2 hover:text-red-300 transition-colors text-xs md:text-sm font-bold uppercase"
                      title="Cancelar"
                    >
                      <XCircle size={20} />
                      <span>Cancelar</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleGerarComprovante(item)}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <FileText size={20} />
                    <span>Gerar Comprovante</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público • Desenvolvido pelo <strong className="text-slate-700">Grupo 2</strong>
        </div>

      </div>
    </div>
  );
}

export default MeusAgendamentos;