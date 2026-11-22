import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ModalComprovante } from '../components/ModalComprovante';

export const ReagendamentoCancelamento = () => {
  // Lista inicial de agendamentos fictícios do utilizador
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      protocolo: 'PROT-938210',
      servico: 'Consulta Odontológica / Atendimento Básico',
      unidade: 'UBS - Socorro do Piauí',
      data: '17/03/2026',
      horario: '14:00',
      status: 'Confirmado'
    },
    {
      id: 2,
      protocolo: 'PROT-402918',
      servico: 'Emissão de Cartão SUS',
      unidade: 'Unidade Central - Teresina',
      data: '22/04/2026',
      horario: '09:30',
      status: 'Confirmado'
    }
  ]);

  // Controlo do modal de comprovante
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [modalComprovanteAberto, setModalComprovanteAberto] = useState(false);

  // Função para Cancelar
  const handleCancelar = (id) => {
    if (window.confirm('Tem certeza de que deseja cancelar este agendamento?')) {
      setAgendamentos(agendamentos.map(item =>
        item.id === id ? { ...item, status: 'Cancelado' } : item
      ));
    }
  };

  // Função para Reagendar
  const handleReagendar = (id) => {
    const novaData = window.prompt('Digite a nova data (Ex: 25/03/2026):');
    const novoHorario = novaData ? window.prompt('Digite o novo horário (Ex: 10:00):') : null;

    if (novaData && novoHorario) {
      setAgendamentos(agendamentos.map(item =>
        item.id === id ? { ...item, data: novaData, horario: novoHorario, status: 'Reagendado' } : item
      ));
    }
  };

  // Abrir comprovante
  const handleGerarComprovante = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setModalComprovanteAberto(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Topo com navegação */}
        <div className="flex justify-between items-center mb-6">
          <a
            href="/dashboard"
            className="p-2 text-indigo-900 hover:bg-indigo-100 rounded-full transition"
            title="Voltar ao início"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>

          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">FILA ZERO</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Portal de Agendamento de Serviços Públicos Online
            </p>
          </div>

          <a
            href="javascript:history.back()"
            className="p-2 text-indigo-900 hover:bg-indigo-100 rounded-full transition"
            title="Voltar página"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
        </div>

        {/* Título */}
        <div className="flex items-center space-x-3 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 bg-indigo-100 text-indigo-900 rounded-lg">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Meus Agendamentos</h2>
        </div>

        {/* Lista de Agendamentos */}
        <div className="space-y-4">
          {agendamentos.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
              {/* Informações Principais */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded-md border border-indigo-200">
                    {item.protocolo}
                  </span>
                  
                  <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md ${
                    item.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Reagendado' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.servico}</h3>

                <div className="text-sm text-slate-600 flex flex-wrap gap-y-1 gap-x-4">
                  <span className="flex items-center gap-1 font-medium">
                    📍 {item.unidade}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    📅 {item.data} às {item.horario}
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                
                {item.status !== 'Cancelado' && (
                  <>
                    <button
                      onClick={() => handleGerarComprovante(item)}
                      className="flex-1 md:flex-none bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition text-center"
                    >
                      Gerar Comprovante
                    </button>

                    <button
                      onClick={() => handleReagendar(item.id)}
                      className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition text-center"
                    >
                      Reagendar
                    </button>

                    <button
                      onClick={() => handleCancelar(item.id)}
                      className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition text-center"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {item.status === 'Cancelado' && (
                  <span className="text-xs text-rose-500 font-semibold italic py-2">
                    Agendamento cancelado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagtinador */}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Páginas</p>
          <div className="inline-flex space-x-2 text-sm font-bold text-indigo-900">
            <span className="w-8 h-8 flex items-center justify-center bg-indigo-900 text-white rounded-lg cursor-pointer">1</span>
            <span className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer">2</span>
            <span className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer">3</span>
          </div>
        </div>

      </main>

      {/* Modal de Comprovante */}
      <ModalComprovante
        isOpen={modalComprovanteAberto}
        agendamento={agendamentoSelecionado}
        onClose={() => setModalComprovanteAberto(false)}
      />
    </div>
  );
};