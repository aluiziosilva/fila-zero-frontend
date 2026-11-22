import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ModalProtocolo } from '../components/ModalProtocolo';

export const Agendamento = () => {
  // Estados para capturar os dados selecionados pelo usuário
  const [servico, setServico] = useState('');
  const [unidade, setUnidade] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  
  // Estados de controle do Modal
  const [protocoloGerado, setProtocoloGerado] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  // Lista mock de opções
  const servicosDisponiveis = [
    { id: '1', nome: 'Emissão de RG / Carteira de Identidade' },
    { id: '2', nome: 'Atualização do Cadastro Único (CadÚnico)' },
    { id: '3', nome: 'Atendimento do IPTU e Certidões' },
    { id: '4', nome: 'Carteira de Trabalho / Vagas SINE' }
  ];

  const unidadesDisponiveis = [
    'Unidade Central - Teresina',
    'Unidade Zona Sul - Parque Piauí',
    'Unidade Zona Leste - Jóquei',
    'Atendimento do Povo - Dirceu'
  ];

  const horariosDisponiveis = [
    '08:00', '09:00', '10:30', '13:00', '14:30', '16:00'
  ];

  // Validação: Botão só ativa se todos os campos forem selecionados
  const formularioCompleto = servico && unidade && data && horario;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formularioCompleto) return;

    // Gera número de protocolo fictício no padrão PROT-XXXXXX
    const protocoloSimulado = `PROT-${Math.floor(100000 + Math.random() * 900000)}`;
    setProtocoloGerado(protocoloSimulado);
    setModalAberto(true);
  };

  const handleLimparFormulario = () => {
    setServico('');
    setUnidade('');
    setData('');
    setHorario('');
    setModalAberto(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Componente de Navegação Principal */}
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Cabeçalho da Tela com Navegação Secundária */}
        <div className="flex justify-between items-center mb-6">
          <a 
            href="/dashboard" 
            className="p-2 text-indigo-900 hover:bg-indigo-100 rounded-full transition duration-200"
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
            className="p-2 text-indigo-900 hover:bg-indigo-100 rounded-full transition duration-200"
            title="Voltar página"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
        </div>

        {/* Título da Seção */}
        <div className="flex items-center space-x-3 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 bg-indigo-100 text-indigo-900 rounded-lg">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Novo Agendamento</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Passo 0: Escolha do Serviço */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Selecione o Serviço Público Desejado:
            </label>
            <select
              value={servico}
              onChange={(e) => setServico(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
              required
            >
              <option value="">-- Escolha um serviço --</option>
              {servicosDisponiveis.map((s) => (
                <option key={s.id} value={s.nome}>{s.nome}</option>
              ))}
            </select>
          </div>

          {/* Passos em Blocos Paralelos (Unidade, Data, Horário) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Passo 1: Unidade */}
            <div className="bg-indigo-900 text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <label className="block text-sm font-semibold mb-3 tracking-wide">
                  Selecione a Unidade de Atendimento
                </label>
                <div className="flex items-center space-x-3 my-2">
                  <svg className="w-8 h-8 text-indigo-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
                  </svg>
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full p-2 bg-indigo-800 text-white border border-indigo-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  >
                    <option value="">Selecione...</option>
                    {unidadesDisponiveis.map((u, i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Passo 2: Data */}
            <div className="bg-indigo-900 text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <label className="block text-sm font-semibold mb-3 tracking-wide">
                  Selecione a Data de Atendimento
                </label>
                <div className="flex items-center space-x-3 my-2">
                  <svg className="w-8 h-8 text-indigo-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full p-2 bg-indigo-800 text-white border border-indigo-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Passo 3: Horário */}
            <div className="bg-indigo-900 text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <label className="block text-sm font-semibold mb-3 tracking-wide">
                  Selecione o Horário de Atendimento
                </label>
                <div className="flex items-center space-x-3 my-2">
                  <svg className="w-8 h-8 text-indigo-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full p-2 bg-indigo-800 text-white border border-indigo-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  >
                    <option value="">Horário...</option>
                    {horariosDisponiveis.map((h, i) => (
                      <option key={i} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Barra de Resumo Dinâmica */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 flex items-center space-x-4 text-indigo-950">
            <div className="p-2 bg-indigo-900 text-white rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-sm md:text-base font-semibold">
              {servico || unidade || data || horario ? (
                <span>
                  <strong>Serviço:</strong> {servico || '---'} | 
                  <strong> Unidade:</strong> {unidade || '---'} | 
                  <strong> Data:</strong> {data || '---'} | 
                  <strong> Horário:</strong> {horario || '---'}
                </span>
              ) : (
                <span className="text-slate-500 font-normal">
                  Preencha os campos acima para ver o resumo do agendamento...
                </span>
              )}
            </div>
          </div>

          {/* Botão Principal de Confirmação com destaque e estados visualmente distintos */}
          <button
            type="submit"
            disabled={!formularioCompleto}
            className={`w-full py-4 rounded-xl font-extrabold text-lg flex items-center justify-center space-x-3 transition duration-200 shadow-lg ${
              formularioCompleto
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>Confirmar Agendamento</span>
          </button>

        </form>
      </main>

      {/* Modal que exibe o protocolo ao confirmar */}
      <ModalProtocolo
        isOpen={modalAberto}
        protocolo={protocoloGerado}
        onClose={handleLimparFormulario}
      />
    </div>
  );
};