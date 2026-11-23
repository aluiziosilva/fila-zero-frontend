import React from "react";
import { Home, ArrowLeft, FileText, Printer } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function ComprovanteAgendamento() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pega os dados do agendamento selecionado em Meus Agendamentos
  const agendamento = location.state?.agendamento || {};

  // Lê o usuário logado salvo pelo Login.jsx
  const session = JSON.parse(localStorage.getItem("@filazero:session") || "{}");
  const usuario = session.user || session;

  const dados = {
    nome: (usuario?.nomeCompleto || usuario?.nome || "Cidadão não identificado").toUpperCase(),
    cpf: usuario?.cpf || "Não informado",
    data: agendamento?.data || "Não informada",
    horario: agendamento?.horario || "Não informado",
    local: (agendamento?.local || agendamento?.servico || "Não informado").toUpperCase(),
    senha: (agendamento?.protocolo || agendamento?.senha || "PROT-2026-001").toUpperCase(),
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-4 md:p-8 print:bg-white print:p-0">
      <div className="w-full flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between print:shadow-none">
        <div>
          {/* Cabeçalho padrão Fila Zero */}
          <div className="w-full flex justify-between items-center pb-6 border-b border-slate-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-3 text-blue-900 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 font-semibold print:hidden"
              title="Início"
            >
              <Home size={28} />
              <span className="hidden sm:inline">Início</span>
            </button>

            <div className="text-center mx-auto">
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wider">
                FILA ZERO
              </h1>
              <p className="text-xs md:text-sm font-semibold text-blue-800 uppercase tracking-wide mt-1">
                Portal de Agendamento de Serviços Públicos Online
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="p-3 text-blue-900 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 font-semibold print:hidden"
              title="Voltar"
            >
              <span className="hidden sm:inline">Voltar</span>
              <ArrowLeft size={28} />
            </button>
          </div>

          {/* Título da Página */}
          <div className="flex items-center justify-center gap-3 my-8">
            <FileText size={34} className="text-blue-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase">
              Comprovante
            </h2>
          </div>

          {/* Cartão Azul do Comprovante */}
          <div className="w-full max-w-3xl mx-auto bg-blue-900 text-white rounded-2xl p-6 md:p-9 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-3 text-base md:text-lg tracking-wide w-full">
              <p>
                <strong className="font-bold">NOME:</strong> {dados.nome}
              </p>
              <p>
                <strong className="font-bold">CPF:</strong> {dados.cpf}
              </p>
              <p>
                <strong className="font-bold">DATA DE ATENDIMENTO:</strong>{" "}
                {dados.data}
              </p>
              <p>
                <strong className="font-bold">HORÁRIO:</strong> {dados.horario}
              </p>
              <p>
                <strong className="font-bold">LOCAL:</strong> {dados.local}
              </p>
              <p>
                <strong className="font-bold">SENHA:</strong> {dados.senha}
              </p>
            </div>

            {/* Divisória sutil */}
            <div className="w-full h-px md:w-px md:h-48 bg-blue-700/60" />

            {/* Bloco QR Code */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <span className="font-extrabold text-base tracking-widest uppercase">
                QR CODE
              </span>
              <div
                className="p-1 rounded-lg bg-blue-900"
                title={`Protocolo: ${dados.senha}`}
              >
                <svg
                  viewBox="0 0 25 25"
                  width="156"
                  height="156"
                  shapeRendering="crispEdges"
                >
                  <rect width="25" height="25" fill="#1e3a8a" />
                  <path fill="#ffffff" d="M1 1h7v7H1zM2 2v5h5V2zm1 1h3v3H3z" />
                  <path fill="#ffffff" d="M17 1h7v7h-7zm1 1v5h5V2zm1 1h3v3h-3z" />
                  <path fill="#ffffff" d="M1 17h7v7H1zm1 1v5h5v-5zm1 1h3v3H3z" />
                  <path
                    fill="#ffffff"
                    d="M10 1h2v2h-2zm3 1h2v3h-2zm-3 3h2v2h-2zm4 1h2v2h-2zM9 9h3v2H9zm4 0h2v3h-2zm3 1h2v2h-2zm3-1h2v3h-2zM1 10h3v2H1zm4 1h3v2H5zm3 2h2v3H8zm3 1h3v2h-3zm4 0h2v3h-2zm3 1h3v2h-3zm3-2h3v2h-3zM10 17h2v3h-2zm3 1h3v2h-3zm4-1h2v2h-2zm3 1h4v2h-4zm-9 3h3v3h-3zm4 1h2v2h-2zm3-1h3v3h-3zm4 1h2v2h-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="w-full max-w-md mx-auto flex flex-col gap-3 mt-8 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <Printer size={20} />
              <span>Imprimir Comprovante</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white hover:bg-slate-50 text-blue-900 border-2 border-blue-900 font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center text-sm uppercase tracking-wider"
            >
              Voltar para o Início
            </button>
          </div>
        </div>

        {/* Rodapé padrão Fila Zero */}
        <div className="pt-6 mt-8 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público •
          Desenvolvido pelo <strong className="text-slate-700">Grupo 2</strong>
        </div>
      </div>
    </div>
  );
}

export default ComprovanteAgendamento;