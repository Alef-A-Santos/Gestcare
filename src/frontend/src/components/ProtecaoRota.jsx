import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

function ProtecaoRota() {
    const [autenticado, setAutenticado] = useState(null);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            credentials: "include"
        })
            .then(async (resposta) => {
                const dados = await resposta.json().catch(() => null);
                setAutenticado(resposta.ok);
                setUsuario(resposta.ok ? (dados?.user ?? null) : null);
            })
            .catch(() => {
                setAutenticado(false);
            });
    }, []);

    if (autenticado === null) {
        return <p>Verificando autenticação...</p>;
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return (
        <UsuarioContext.Provider value={usuario}>
            <Outlet />
        </UsuarioContext.Provider>
    );
}

export default ProtecaoRota;
