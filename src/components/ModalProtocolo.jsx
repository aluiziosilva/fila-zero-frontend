import React from 'react';

export const ModalComprovante = ({ isOpen, agendamento, onClose }) => {
  if (!isOpen || !agendamento) return null;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border border-slate-200">
        
        {/* Cabeçalho do Comprovante */}
        <div className="text-center border-b border-slate-200 pb-4 mb-4">
          <h2 className="text-2xl font-black text-indigo-900 tracking-wide">FILA ZERO</h2>
          <p className="text-xs font-semibold text-slate-500 uppercase">Comprovante de Agendamento</p>
        </div>

        {/* Detalhes do Agendamento */}
        <div className="space-y-3 text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase">Protocolo</span>
            <span className="font-mono font-bold text-lg text-indigo-900">{agendamento.protocolo}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase">Serviço</span>
            <span className="font-semibold text-slate-800">{agendamento.servico}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase">Unidade de Atendimento</span>
            <span className="font-medium text-slate-800">{agendamento.unidade}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
            <div>
              <span className="text-xs text-slate-400 font-bold block uppercase">Data</span>
              <span className="font-bold text-slate-800">{agendamento.data}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block uppercase">Horário</span>
              <span className="font-bold text-slate-800">{agendamento.horario}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            onClick={handleImprimir}
            className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir / PDF
          </button>
          
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};