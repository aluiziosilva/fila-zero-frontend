import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  ArrowLeft,
  BarChart3,
  Printer,
  Calendar,
  CheckCircle2,
  XCircle,
  Building2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, ENDPOINTS } from "../services/api";

function extrairDataHora(item) {
  if (item.data && item.horario) {
    return `${item.data} às ${item.horario}`;
  }
  if (item.data_Hora) {
    const [parteData, parteHora] = String(item.data_Hora).split("T");
    const dataFmt = parteData ? parteData.split("-").reverse().join("/") : "";
    const horaFmt = parteHora ? parteHora.slice(0, 5) : "";
    return `${dataFmt} às ${horaFmt}`;
  }
  return "-";
}

export function RelatoriosGerenciais() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [resumoServidor, setResumoServidor] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroUnidade, setFiltroUnidade] = useState("TODAS");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await api.get(ENDPOINTS.relatorios);

        if (Array.isArray(resposta)) {
          setRegistros(resposta);
        } else if (resposta && typeof resposta === "object") {
          const lista =
            resposta.agendamentos ||
            resposta.dados ||
            resposta.relatorio ||
            resposta.registros ||
            [];
          setRegistros(Array.isArray(lista) ? lista : []);
          setResumoServidor(resposta);
        }
      } catch (err) {
        setErro(
          err.message || "Erro ao carregar dados para o relatório gerencial."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const obterNomeServico = (r) => {
    if (typeof r.servico === "object" && r.servico !== null) {
      return r.servico.descricao || r.servico.nome || "Não especificada";
    }
    return r.servico || r.unidade || "Não especificada";
  };

  const unidadesDisponiveis = useMemo(() => {
    const setUnidades = new Set(registros.map(obterNomeServico).filter(Boolean));
    return ["TODAS", ...Array.from(setUnidades)];
  }, [registros]);

  const filtrados = useMemo(() => {
    if (filtroUnidade === "TODAS") return registros;
    return registros.filter((r) => obterNomeServico(r) === filtroUnidade);
  }, [registros, filtroUnidade]);

  const metricas = useMemo(() => {
    if (registros.length === 0 && resumoServidor) {
      return {
        total:
          resumoServidor.total ??
          resumoServidor.totalAgendamentos ??
          0,
        confirmados:
          resumoServidor.confirmados ??
          resumoServidor.ativos ??
          0,
        reagendados: resumoServidor.reagendados ?? 0,
        cancelados: resumoServidor.cancelados ?? 0,
        porUnidade: resumoServidor.porUnidade || {},
      };
    }

    const total = filtrados.length;
    const confirmados = filtrados.filter(
      (r) => (r.status || "CONFIRMADO").toUpperCase() === "CONFIRMADO"
    ).length;
    const reagendados = filtrados.filter(
      (r) => (r.status || "").toUpperCase() === "REAGENDADO"
    ).length;
    const cancelados = filtrados.filter(
      (r) => (r.status || "").toUpperCase() === "CANCELADO"
    ).length;

    const porUnidade = {};
    filtrados.forEach((r) => {
      const nome = obterNomeServico(r);
      porUnidade[nome] = (porUnidade[nome] || 0) + 1;
    });

    return { total, confirmados, reagendados, cancelados, porUnidade };
  }, [filtrados, registros.length, resumoServidor]);

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-4 md:p-8 print:bg-white print:p-0">
      <div className="w-full flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between print:shadow-none">
        <div>
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

          <div className="flex items-center justify-center gap-3 my-8">
            <BarChart3 size={34} className="text-blue-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase">
              Relatórios Gerenciais
            </h2>
          </div>

          {erro && (
            <div className="w-full max-w-5xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-semibold text-sm">
              <AlertCircle size={22} className="shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {carregando ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-blue-900 font-semibold">
              <Loader2 size={40} className="animate-spin" />
              <span>Gerando indicadores gerenciais...</span>
            </div>
          ) : (
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 print:hidden">
                <div className="flex items-center gap-3">
                  <Building2 size={22} className="text-blue-900" />
                  <label
                    htmlFor="filtro-unidade"
                    className="text-sm font-bold text-blue-900 uppercase"
                  >
                    Serviço / Unidade:
                  </label>
                  <select
                    id="filtro-unidade"
                    value={filtroUnidade}
                    onChange={(e) => setFiltroUnidade(e.target.value)}
                    className="bg-white border border-slate-300 text-blue-900 font-semibold text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {unidadesDisponiveis.map((u, idx) => (
                      <option key={idx} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow"
                >
                  <Printer size={18} />
                  <span>Imprimir Relatório</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Total Geral
                    </span>
                    <Calendar size={22} />
                  </div>
                  <p className="text-4xl font-extrabold mt-3">
                    {metricas.total}
                  </p>
                  <span className="text-xs text-blue-200 mt-1">
                    Atendimentos registrados
                  </span>
                </div>

                <div className="bg-blue-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Confirmados
                    </span>
                    <CheckCircle2 size={22} />
                  </div>
                  <p className="text-4xl font-extrabold mt-3">
                    {metricas.confirmados}
                  </p>
                  <span className="text-xs text-blue-200 mt-1">
                    Agendamentos ativos
                  </span>
                </div>

                <div className="bg-blue-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Reagendados
                    </span>
                    <BarChart3 size={22} />
                  </div>
                  <p className="text-4xl font-extrabold mt-3">
                    {metricas.reagendados}
                  </p>
                  <span className="text-xs text-blue-200 mt-1">
                    Alterações de horário
                  </span>
                </div>

                <div className="bg-blue-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Cancelados
                    </span>
                    <XCircle size={22} />
                  </div>
                  <p className="text-4xl font-extrabold mt-3">
                    {metricas.cancelados}
                  </p>
                  <span className="text-xs text-blue-200 mt-1">
                    Vagas liberadas
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-base font-extrabold text-blue-900 uppercase tracking-wide mb-4">
                  Demanda por Serviço / Unidade
                </h3>

                {Object.keys(metricas.porUnidade).length === 0 ? (
                  <p className="text-sm text-slate-500 font-medium">
                    Nenhum atendimento encontrado para o filtro selecionado.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {Object.entries(metricas.porUnidade).map(([nome, qtd]) => {
                      const percentual =
                        metricas.total > 0
                          ? Math.round((qtd / metricas.total) * 100)
                          : 0;
                      return (
                        <div key={nome} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs md:text-sm font-bold text-blue-950">
                            <span>{nome}</span>
                            <span>
                              {qtd} ({percentual}%)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-900 rounded-full transition-all"
                              style={{ width: `${percentual}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4">Protocolo</th>
                      <th className="py-3.5 px-4">Cidadão</th>
                      <th className="py-3.5 px-4">Serviço / Unidade</th>
                      <th className="py-3.5 px-4">Data / Hora</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-medium">
                    {filtrados.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-slate-400"
                        >
                          Nenhum registro para exibir.
                        </td>
                      </tr>
                    ) : (
                      filtrados.map((item) => {
                        const idReal = item.id_Agendamento ?? item.id;
                        return (
                          <tr key={idReal} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-blue-900">
                              {item.protocolo || `FZ-${idReal}`}
                            </td>
                            <td className="py-3 px-4">
                              {item.cidadao?.nome ||
                                item.usuario?.nome ||
                                item.nomeCompleto ||
                                `Cidadão #${item.id_Cidadao || ""}`}
                            </td>
                            <td className="py-3 px-4">{obterNomeServico(item)}</td>
                            <td className="py-3 px-4">{extrairDataHora(item)}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                                {item.status || "CONFIRMADO"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 mt-8 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          © 2026 Fila Zero • Sistema de Gestão de Atendimento Público •
          Desenvolvido pelo <strong className="text-slate-700">Grupo 2</strong>
        </div>
      </div>
    </div>
  );
}

export default RelatoriosGerenciais;