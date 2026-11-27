import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function RedirecionarUsuarioAutenticado({ children }) {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    let ativo = true;

    fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((resposta) => {
        if (ativo) setAutenticado(resposta.ok);
      })
      .catch(() => {
        if (ativo) setAutenticado(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (autenticado === null) {
    return <p>Verificando autenticação...</p>;
  }

  if (autenticado) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default RedirecionarUsuarioAutenticado;
