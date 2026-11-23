import React, { useState, useEffect } from "react";
import {
  Home,
  ArrowLeft,
  Calendar,
  RotateCcw,
  XCircle,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  api,
  ENDPOINTS,
  obterUsuarioLogado,
  formatarCPF,
} from "../services/api";

function extrairDataHora(item) {
  if (item.data && item.horario) {
    return { dataFormatada: item.data, horarioFormatado: item.horario };
  }
  if (item.data_Hora) {
    const iso = String(item.data_Hora);
    const [parteData, parteHora] = iso.split("T");
    const dataFormatada = parteData
      ? parteData.split("-").reverse().join("/")
      : "";
    const horarioFormatado = parteHora ? parteHora.slice(0, 5) : "";
    return { dataFormatada, horarioFormatado };
  }
  return { dataFormatada: "", horarioFormatado: "" };
}

function extrairNomeServico(item) {
  if (typeof item.servico === "object" && item.servico !== null) {
    const desc = item.servico.descricao || item.servico.nome || "Atendimento";
    const sec =
      item.servico.secretaria?.nome || item.servico.secretaria?.descricao;
    return sec ? `${desc} - ${sec}` : desc;
  }
  return item.servico || item.unidade || "Atendimento";
}

export function MeusAgendamentos() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [cancelandoId, setCancelandoId] = useState(null);

  useEffect(() => {
    async function buscarAgendamentos() {
      try {
        setCarregando(true);
        setErro("");
        const usuario = obterUsuarioLogado();
        const userId = usuario?.id_Usuario ?? usuario?.id;

        if (!userId) {
          setErro("Sessão inválida. Clique em Sair e faça login novamente.");
          setCarregando(false);
          return;
        }

        const resposta = await api.get(ENDPOINTS.agendamentosUsuario(userId));
        const listaGeral = Array.isArray(resposta)
          ? resposta
          : resposta.agendamentos || [];

        const ativos = listaGeral.filter(
          (item) => (item.status || "").toUpperCase() !== "CANCELADO"
        );
        setAgendamentos([...ativos].reverse());
      } catch (err) {
        setErro(
          err.message || "Erro ao carregar seus agendamentos do servidor."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarAgendamentos();
  }, []);

  const handleCancelar = async (idAgendamento) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      setCancelandoId(idAgendamento);
      setErro("");
      await api.put(ENDPOINTS.cancelarAgendamento(idAgendamento), {
        status: "CANCELADO",
      });
      setAgendamentos((prev) =>
        prev.filter((item) => (item.id_Agendamento ?? item.id) !== idAgendamento)
      );
    } catch (err) {
      setErro(err.message || "Não foi possível cancelar o agendamento.");
    } finally {
      setCancelandoId(null);
    }
  };

  const handleReagendar = (idAgendamento) => {
    navigate(`/agendamento?reagendarId=${idAgendamento}`);
  };

  const handleGerarComprovante = (item) => {
    const usuario = obterUsuarioLogado();
    const { dataFormatada, horarioFormatado } = extrairDataHora(item);
    const nomeServico = extrairNomeServico(item);

    const itemFormatado = {
      ...item,
      id: item.id_Agendamento ?? item.id,
      nomeCompleto: usuario?.nome || usuario?.nomeCompleto || "Cidadão",
      cpf: formatarCPF(usuario?.cpf || ""),
      servico: nomeServico,
      unidade: nomeServico,
      data: dataFormatada,
      horario: horarioFormatado,
    };

    navigate("/comprovante", { state: { agendamento: itemFormatado } });
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-4 md:p-8">
      <div className="w-full flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between">
        <div>
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

          <div className="flex items-center justify-center gap-3 my-8">
            <Calendar size={36} className="text-blue-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase">
              Meus Agendamentos
            </h2>
          </div>

          {erro && (
            <div className="w-full max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-semibold text-sm">
              <AlertCircle size={22} className="shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 my-6">
            {carregando ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-blue-900 font-semibold">
                <Loader2 size={40} className="animate-spin" />
                <span>Carregando seus agendamentos...</span>
              </div>
            ) : agendamentos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-lg">
                  Você ainda não possui nenhum agendamento registrado.
                </p>
                <button
                  onClick={() => navigate("/agendamento")}
                  className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Criar Agendamento
                </button>
              </div>
            ) : (
              agendamentos.map((item) => {
                const idReal = item.id_Agendamento ?? item.id;
                const nomeServico = extrairNomeServico(item);
                const { dataFormatada, horarioFormatado } = extrairDataHora(item);

                return (
                  <div key={idReal} className="flex flex-col gap-2">
                    <div className="bg-blue-900 text-white rounded-2xl p-4 md:p-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shadow-md">
                      <button
                        onClick={() => handleReagendar(idReal)}
                        disabled={cancelandoId === idReal}
                        className="flex items-center gap-2 hover:text-blue-200 transition-colors text-xs md:text-sm font-bold uppercase disabled:opacity-50"
                        title="Reagendar"
                      >
                        <RotateCcw size={20} />
                        <span>Reagendar</span>
                      </button>

                      <div className="text-center font-bold text-base md:text-lg tracking-wide flex-1">
                        {nomeServico} - {dataFormatada} - {horarioFormatado}
                      </div>

                      <button
                        onClick={() => handleCancelar(idReal)}
                        disabled={cancelandoId === idReal}
                        className="flex items-center gap-2 hover:text-red-300 transition-colors text-xs md:text-sm font-bold uppercase disabled:opacity-50"
                        title="Cancelar"
                      >
                        {cancelandoId === idReal ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <XCircle size={20} />
                        )}
                        <span>
                          {cancelandoId === idReal
                            ? "Cancelando..."
                            : "Cancelar"}
                        </span>
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
                );
              })
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público •
          Desenvolvido pelo <strong className="text-slate-700">Grupo 2</strong>
        </div>
      </div>
    </div>
  );
}

export default MeusAgendamentos;