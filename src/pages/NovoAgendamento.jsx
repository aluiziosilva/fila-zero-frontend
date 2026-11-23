import React, { useState, useEffect } from "react";
import {
  Home,
  ArrowLeft,
  CalendarCheck,
  Building2,
  Calendar,
  Clock,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, ENDPOINTS, obterUsuarioLogado } from "../services/api";

export function NovoAgendamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reaganId = searchParams.get("reagendarId");

  const [servicosLista, setServicosLista] = useState([]);
  const [carregandoServicos, setCarregandoServicos] = useState(true);

  const [servicoIdSelecionado, setServicoIdSelecionado] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const horariosDisponiveis = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  useEffect(() => {
    async function carregarServicos() {
      try {
        setCarregandoServicos(true);
        const resposta = await api.get(ENDPOINTS.servicos);
        const lista = Array.isArray(resposta)
          ? resposta
          : resposta.servicos || [];

        const formatados = lista
          .map((item) => {
            const id = item.id_Servico ?? item.id;
            const desc = item.descricao || item.nome || item.unidade;
            const sec = item.secretaria?.nome || item.secretaria?.descricao;
            return {
              id_Servico: id,
              nome: sec ? `${desc} - ${sec}` : desc,
            };
          })
          .filter((s) => s.id_Servico && s.nome);

        setServicosLista(formatados);
      } catch (err) {
        setErro(
          err.message || "Erro ao carregar a lista de serviços do servidor."
        );
      } finally {
        setCarregandoServicos(false);
      }
    }

    carregarServicos();
  }, []);

  const servicoAtual = servicosLista.find(
    (s) => String(s.id_Servico) === String(servicoIdSelecionado)
  );

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setErro("");

    if (!servicoIdSelecionado || !data || !horario) {
      setErro(
        "Por favor, preencha o serviço/unidade, a data e o horário antes de confirmar."
      );
      return;
    }

    const usuarioLogado = obterUsuarioLogado();
    const idCidadao = Number(usuarioLogado?.id_Usuario ?? usuarioLogado?.id);

    if (!idCidadao || Number.isNaN(idCidadao)) {
      setErro("Cidadão não identificado. Clique em Sair e faça login novamente.");
      return;
    }

    setEnviando(true);

    try {
      const payload = {
        id_Cidadao: idCidadao,
        id_Servico: Number(servicoIdSelecionado),
        data, // Formato YYYY-MM-DD exigido pelo agendamentoController.ts
        horario,
      };

      if (reaganId) {
        await api.put(ENDPOINTS.reagendarAgendamento(reaganId), payload);
      } else {
        await api.post(ENDPOINTS.agendamentos, payload);
      }

      navigate("/meus-agendamentos");
    } catch (err) {
      setErro(
        err.message ||
          "Não foi possível concluir o agendamento. Verifique os dados."
      );
    } finally {
      setEnviando(false);
    }
  };

  const dataExibicao = data
    ? data.split("-").reverse().join("/")
    : "DD/MM/AAAA";

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-4 md:p-8">
      <div className="w-full flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between">
        <div>
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

          <div className="flex items-center justify-center gap-3 my-8">
            <CalendarCheck size={36} className="text-blue-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase">
              {reaganId ? "Reagendar Atendimento" : "Novo Agendamento"}
            </h2>
          </div>

          {erro && (
            <div className="w-full max-w-5xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-semibold text-sm">
              <AlertCircle size={22} className="shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {!carregandoServicos && servicosLista.length === 0 && (
            <div className="w-full max-w-5xl mx-auto mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-800 font-semibold text-sm text-center">
              Nenhum serviço encontrado no banco de dados. Cadastre ao menos um serviço/secretaria no banco para liberar o agendamento.
            </div>
          )}

          <form
            onSubmit={handleConfirmar}
            className="w-full max-w-5xl mx-auto flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900 text-white rounded-2xl p-5 flex flex-col items-center justify-between shadow-lg min-h-[160px]">
                <label
                  htmlFor="select-unidade"
                  className="text-sm font-bold text-center uppercase tracking-wider mb-2"
                >
                  SELECIONE O SERVIÇO / UNIDADE
                </label>
                <Building2 size={44} className="my-2" />
                <select
                  id="select-unidade"
                  value={servicoIdSelecionado}
                  disabled={carregandoServicos || enviando}
                  onChange={(e) => setServicoIdSelecionado(e.target.value)}
                  className="w-full bg-blue-950 text-white font-semibold text-center py-2 px-3 rounded-xl border border-blue-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer disabled:opacity-60"
                >
                  <option value="">
                    {carregandoServicos
                      ? "Carregando serviços..."
                      : "Selecione..."}
                  </option>
                  {servicosLista.map((s) => (
                    <option key={s.id_Servico} value={s.id_Servico}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-900 text-white rounded-2xl p-5 flex flex-col items-center justify-between shadow-lg min-h-[160px]">
                <label
                  htmlFor="input-data"
                  className="text-sm font-bold text-center uppercase tracking-wider mb-2"
                >
                  SELECIONE A DATA DE ATENDIMENTO
                </label>
                <Calendar size={44} className="my-2" />
                <input
                  id="input-data"
                  type="date"
                  value={data}
                  disabled={enviando}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full bg-blue-950 text-white font-semibold text-center py-2 px-3 rounded-xl border border-blue-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer disabled:opacity-60"
                />
              </div>

              <div className="bg-blue-900 text-white rounded-2xl p-5 flex flex-col items-center justify-between shadow-lg min-h-[160px]">
                <label
                  htmlFor="select-horario"
                  className="text-sm font-bold text-center uppercase tracking-wider mb-2"
                >
                  SELECIONE O HORÁRIO DE ATENDIMENTO
                </label>
                <Clock size={44} className="my-2" />
                <select
                  id="select-horario"
                  value={horario}
                  disabled={enviando}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full bg-blue-950 text-white font-semibold text-center py-2 px-3 rounded-xl border border-blue-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer disabled:opacity-60"
                >
                  <option value="">Selecione...</option>
                  {horariosDisponiveis.map((h, i) => (
                    <option key={i} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full bg-blue-900 text-white rounded-2xl p-5 flex items-center justify-center gap-4 shadow-lg">
              <ClipboardList size={32} className="hidden sm:block" />
              <p className="text-lg md:text-xl font-bold uppercase tracking-wide text-center">
                {servicoAtual?.nome || "SERVIÇO / UNIDADE"} - {dataExibicao} -{" "}
                {horario || "HORÁRIO"}
              </p>
            </div>

            <button
              type="submit"
              disabled={enviando || servicosLista.length === 0}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-center uppercase tracking-wider text-xl transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              {enviando ? (
                <>
                  <Loader2 size={26} className="animate-spin" />
                  <span>Salvando no servidor...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={26} />
                  <span>
                    {reaganId ? "Confirmar Reagendamento" : "Confirmar"}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium mt-8">
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público •
          Desenvolvido pelo <strong className="text-slate-700">Grupo 2</strong>
        </div>
      </div>
    </div>
  );
}

export default NovoAgendamento;