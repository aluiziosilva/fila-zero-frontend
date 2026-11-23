const API_BASE_URL = "http://localhost:3001";

export const ENDPOINTS = {
  cadastro: "/usuarios",
  login: "/login",
  servicos: "/servicos",
  horariosVagos: "/horarios-vagos",
  agendamentos: "/agendamentos",
  agendamentosUsuario: (id) => `/agendamentos/usuario/${id}`,
  cancelarAgendamento: (id) => `/agendamentos/${id}/cancelar`,
  reagendarAgendamento: (id) => `/agendamentos/${id}/reagendar`,
  relatorios: "/relatorios",
};

const SESSION_KEY = "@filazero:session";

export function formatarCPF(cpf) {
  const numeros = String(cpf || "").replace(/\D/g, "");
  if (numeros.length !== 11) return cpf || "";
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function salvarSessao({ token, usuario }) {
  const userObj = usuario || {};
  const idReal = userObj.id_Usuario ?? userObj.id ?? "";
  const nomeReal = userObj.nome || userObj.nomeCompleto || "";
  const cpfFormatado = formatarCPF(userObj.cpf);

  const sessionData = {
    token: token || "",
    id: idReal,
    id_Usuario: idReal,
    usuarioId: String(idReal),
    nome: nomeReal,
    nomeCompleto: nomeReal,
    cpf: cpfFormatado,
    email: userObj.email || "",
    tipo: userObj.tipo || "CIDADAO",
    user: {
      ...userObj,
      id: idReal,
      id_Usuario: idReal,
      nome: nomeReal,
      nomeCompleto: nomeReal,
      cpf: cpfFormatado,
    },
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

export function obterSessao() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

export function obterUsuarioLogado() {
  const session = obterSessao();
  const base = session.user || session;
  const idReal = base.id_Usuario ?? base.id ?? session.id_Usuario ?? session.id;
  const nomeReal =
    base.nome || base.nomeCompleto || session.nome || session.nomeCompleto || "";
  const cpfFormatado = formatarCPF(base.cpf || session.cpf || "");

  return {
    ...session,
    ...base,
    id: idReal,
    id_Usuario: idReal,
    nome: nomeReal,
    nomeCompleto: nomeReal,
    cpf: cpfFormatado,
  };
}

export function limparSessao() {
  localStorage.removeItem(SESSION_KEY);
}

async function request(endpoint, options = {}) {
  const session = obterSessao();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o Back-End está rodando na porta 3001."
    );
  }

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    const textoLimpo = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    data = { message: textoLimpo };
  }

  if (!response.ok) {
    if (response.status === 401) {
      limparSessao();
    }
    const mensagemErro =
      data?.erro ||
      data?.error ||
      data?.message ||
      `Erro na requisição (código ${response.status}).`;
    throw new Error(mensagemErro);
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};