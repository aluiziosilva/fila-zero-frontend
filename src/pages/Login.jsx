import React, { useState } from "react";
import {
  CreditCard,
  Lock,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { api, ENDPOINTS, salvarSessao } from "../services/api";

export function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formatCpf(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function handleChange(e) {
    const { id, value } = e.target;
    const newValue = id === "cpf" ? formatCpf(value) : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));

    if (errors[id] || errors.general) {
      setErrors((prev) => ({ ...prev, [id]: null, general: null }));
    }
    if (successMessage) setSuccessMessage("");
  }

  function validate() {
    const newErrors = {};

    if (isRegister) {
      if (!formData.nomeCompleto.trim())
        newErrors.nomeCompleto = "Informe o seu nome completo.";
      if (!formData.cpf.trim()) newErrors.cpf = "Informe o seu CPF.";
      if (!formData.dataNascimento.trim())
        newErrors.dataNascimento = "Informe a sua data de nascimento.";
      if (!formData.email.trim()) newErrors.email = "Informe o seu e-mail.";
      if (!formData.senha) {
        newErrors.senha = "Informe a sua senha.";
      } else if (formData.senha.length < 6) {
        newErrors.senha = "A senha deve ter no mínimo 6 dígitos.";
      }
      if (formData.confirmarSenha !== formData.senha) {
        newErrors.confirmarSenha = "As senhas não coincidem.";
      }
    } else {
      if (!formData.cpf.trim()) newErrors.cpf = "Informe o seu CPF.";
      if (!formData.senha) newErrors.senha = "Informe a sua senha.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      if (isRegister) {
        await api.post(ENDPOINTS.cadastro, {
          nomeCompleto: formData.nomeCompleto.trim(),
          nome: formData.nomeCompleto.trim(),
          cpf: formData.cpf,
          dataNascimento: formData.dataNascimento,
          email: formData.email.trim(),
          senha: formData.senha,
        });

        setSuccessMessage(
          "Cadastro realizado com sucesso! Faça login para continuar."
        );
        setFormData((prev) => ({ ...prev, senha: "", confirmarSenha: "" }));
        setIsRegister(false);
      } else {
        const resposta = await api.post(ENDPOINTS.login, {
          cpf: formData.cpf,
          senha: formData.senha,
        });

        const token = resposta.token || resposta.accessToken || "";
        const usuario = resposta.usuario || resposta.user || {
          id: resposta.id || resposta.usuarioId,
          nomeCompleto: resposta.nomeCompleto || resposta.nome || "Cidadão",
          cpf: formData.cpf,
          email: resposta.email || "",
        };

        salvarSessao({ token, usuario });
        navigate("/dashboard");
      }
    } catch (err) {
      setErrors({
        general: err.message || "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleMode = (register) => {
    setIsRegister(register);
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-900 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">
            {isRegister ? "Cadastrar Usuário" : "Faça login para continuar"}
          </h1>
          <p className="text-xs uppercase tracking-wider text-blue-200 mt-1">
            Fila Zero • Portal de Agendamento Público
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700 font-medium">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700 font-medium">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {isRegister ? (
              <>
                <Input
                  id="nomeCompleto"
                  label="Nome Completo"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  icon={User}
                  error={errors.nomeCompleto}
                />
                <Input
                  id="cpf"
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  icon={CreditCard}
                  error={errors.cpf}
                />
                <Input
                  id="dataNascimento"
                  label="Data de Nascimento"
                  placeholder="DD/MM/AAAA"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  icon={Calendar}
                  error={errors.dataNascimento}
                />
                <Input
                  id="email"
                  label="Digite seu Email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  error={errors.email}
                />
                <Input
                  id="senha"
                  type="password"
                  label="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  icon={Lock}
                  error={errors.senha}
                />
                <Input
                  id="confirmarSenha"
                  type="password"
                  label="Confirmar Senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  icon={Lock}
                  error={errors.confirmarSenha}
                />
              </>
            ) : (
              <>
                <Input
                  id="cpf"
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  icon={CreditCard}
                  error={errors.cpf}
                />
                <Input
                  id="senha"
                  type="password"
                  label="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  icon={Lock}
                  error={errors.senha}
                />
              </>
            )}

            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting
                ? "Processando..."
                : isRegister
                ? "Cadastrar"
                : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {isRegister ? (
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className="text-blue-900 font-semibold hover:underline"
              >
                Já possui uma conta? Fazer login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className="text-blue-900 font-semibold hover:underline"
              >
                Ainda não possui uma conta? Cadastrar usuário
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;