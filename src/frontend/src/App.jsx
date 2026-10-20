import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Cadastro from "./pages/Cadastro";
import Verificacao from "./pages/Verificacao";
import RecSenha from "./pages/recSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Home from "./pages/Home";
import ProtecaoRota from "./components/ProtecaoRota";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Cadastro" element={<Cadastro />} />
      <Route path="/Cadastro/Verificacao" element={<Verificacao />} />
      <Route path="/recSenha" element={<RecSenha />} />
      <Route path="/recSenha/Verificacao" element={<Verificacao />} />
      <Route path="/login" element={<Login />} />
      <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
      {/* ROTAS PROTEGIDAS! */}
             <Route element={<ProtecaoRota />}>
                   <Route path="/home" element={<Home />} />
             </Route>
    </Routes>
  );
}

export default App;
