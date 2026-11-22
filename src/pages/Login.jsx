import React, { useState } from "react";
import { CreditCard, Lock, User, Mail, Calendar, AlertCircle } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Máscara de CPF
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

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  }

  function validate() {
    const newErrors = {};

    if (isRegister) {
      if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = "Informe o seu nome completo.";
      if (!formData.cpf.trim()) newErrors.cpf = "Informe o seu CPF.";
      if (!formData.dataNascimento.trim()) newErrors.dataNascimento = "Informe a sua data de nascimento.";
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (isRegister) {
        const usuarios = JSON.parse(localStorage.getItem("@filazero:usuarios") || "[]");
        
        // Verifica se o CPF já está cadastrado
        const usuarioExistente = usuarios.find(
          (u) => u.cpf.replace(/\D/g, "") === formData.cpf.replace(/\D/g, "")
        );

        if (usuarioExistente) {
          setErrors({ general: "Este CPF já está cadastrado no sistema." });
          setIsSubmitting(false);
          return;
        }

        const novoUsuario = { 
          id: String(Date.now()), 
          ...formData 
        };
        
        localStorage.setItem("@filazero:usuarios", JSON.stringify([...usuarios, novoUsuario]));
        alert("Usuário cadastrado com sucesso!");
        setIsRegister(false);
      } else {
        const usuarios = JSON.parse(localStorage.getItem("@filazero:usuarios") || "[]");
        const usuario = usuarios.find(
          (u) =>
            u.cpf.replace(/\D/g, "") === formData.cpf.replace(/\D/g, "") &&
            u.senha === formData.senha
        );

        if (!usuario) {
          setErrors({ general: "CPF ou senha inválidos." });
        } else {
          // Salva os dados do usuário + um token fictício para autorizar a navegação nas rotas protegidas
          const sessionData = {
            token: "fake-jwt-token-filazero",
            user: usuario,
            ...usuario
          };

          localStorage.setItem("@filazero:session", JSON.stringify(sessionData));
          navigate("/dashboard");
        }
      }
      setIsSubmitting(false);
    }, 800);
  }

  const toggleMode = (register) => {
    setIsRegister(register);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">
            {isRegister ? "Cadastrar Usuário" : "Faça login para continuar"}
          </h1>
          {isRegister && (
            <p className="text-sm mt-2">Portal de Agendamento de Serviços Públicos Online</p>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {isRegister ? (
              <>
                <Input id="nomeCompleto" label="Nome Completo" value={formData.nomeCompleto} onChange={handleChange} icon={User} error={errors.nomeCompleto} />
                <Input id="cpf" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} icon={CreditCard} error={errors.cpf} />
                <Input id="dataNascimento" label="Data de Nascimento" placeholder="DD/MM/AAAA" value={formData.dataNascimento} onChange={handleChange} icon={Calendar} error={errors.dataNascimento} />
                <Input id="email" label="Digite seu Email" placeholder="exemplo@email.com" value={formData.email} onChange={handleChange} icon={Mail} error={errors.email} />
                <Input id="senha" type="password" label="Senha" value={formData.senha} onChange={handleChange} icon={Lock} error={errors.senha} />
                <Input id="confirmarSenha" type="password" label="Confirmar Senha" value={formData.confirmarSenha} onChange={handleChange} icon={Lock} error={errors.confirmarSenha} />
              </>
            ) : (
              <>
                <Input id="cpf" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} icon={CreditCard} error={errors.cpf} />
                <Input id="senha" type="password" label="Senha" value={formData.senha} onChange={handleChange} icon={Lock} error={errors.senha} />
              </>
            )}

            <Button type="submit" isLoading={isSubmitting}>
              {isRegister ? "Cadastrar" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {isRegister ? (
              <button onClick={() => toggleMode(false)} className="text-blue-600 hover:underline">
                Já possui uma conta? Fazer login
              </button>
            ) : (
              <button onClick={() => toggleMode(true)} className="text-blue-600 hover:underline">
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