# 🖥️ Fila Zero — Front-End

Interface web do sistema **Fila Zero**, desenvolvida para permitir que cidadãos e servidores realizem, consultem, reagendem e cancelem atendimentos públicos de forma rápida e responsiva, além de emitir comprovantes e acompanhar relatórios gerenciais.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **Vite**
- **Tailwind CSS** (estilização e layout responsivo)
- **React Router DOM 7** (gerenciamento de rotas)
- **Lucide React Icons** (ícones da interface)
- **Fetch API + LocalStorage** (integração RESTful e sessão JWT)

---

## ✨ Funcionalidades Principais

- Cadastro e login de cidadãos com autenticação via token JWT
- Agendamento de atendimentos com seleção dinâmica de serviços e unidades
- Consulta, reagendamento e cancelamento em **Meus Agendamentos**
- Emissão de comprovante digital com protocolo único, CPF formatado e QR Code
- Painel de **Relatórios Gerenciais** com indicadores, filtro por unidade, gráfico de demanda e impressão

---

## 🚀 Como Executar o Front-End

> **Pré-requisito:** Certifique-se de que o servidor **Back-End** esteja em execução em `http://localhost:3001`.

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev