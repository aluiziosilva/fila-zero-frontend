// src/pages/usuarios/CadastrarUsuario.jsx
import React, { useState } from "react";

export function CadastrarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Usuário cadastrado:", { nome, email });
    // aqui você pode adicionar lógica para salvar no backend ou localStorage
  }

  return (
    <div>
      <h1>Cadastrar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
