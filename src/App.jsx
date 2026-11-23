import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import ComprovanteAgendamento from "./pages/ComprovanteAgendamento";
import RelatoriosGerenciais from "./pages/RelatoriosGerenciais";

// Componente para proteger as rotas
function PrivateRoute({ children }) {
  const session = localStorage.getItem("@filazero:session");
  return session ? children : <Navigate to="/" replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/agendamento"
          element={
            <PrivateRoute>
              <NovoAgendamento />
            </PrivateRoute>
          }
        />

        <Route
          path="/meus-agendamentos"
          element={
            <PrivateRoute>
              <MeusAgendamentos />
            </PrivateRoute>
          }
        />

        <Route
          path="/comprovante"
          element={
            <PrivateRoute>
              <ComprovanteAgendamento />
            </PrivateRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <RelatoriosGerenciais />
            </PrivateRoute>
          }
        />

        {/* Redirecionamento padrão para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;