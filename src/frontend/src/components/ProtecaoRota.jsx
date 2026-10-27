import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtecaoRota() {
    const [autenticado, setAutenticado] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            credentials: "include"
        })
            .then((resposta) => {
                setAutenticado(resposta.ok);
                console.log(resposta  )
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

    return <Outlet />;
}

export default ProtecaoRota;