import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Cadastro from "./pages/Cadastro";
import Verificacao from "./pages/Verificacao";
import RecSenha from "./pages/recSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Home from "./pages/Home";
import ProtecaoRota from "./components/ProtecaoRota";
import LayoutPrincipal from "./components/LayoutPrincipal";
import HistoricoGlicemico from "./pages/HistoricoGlicemico";
import DiarioAlimentar from "./pages/DiarioAlimentar";
import Lembretes from "./pages/Lembretes";
import NumeroEmergencia from "./pages/NumeroEmergencia";
import DicasEducativas from "./pages/DicasEducativas";

function App() {
  return (
    <Routes>
      {/* Rotas públicas (sem sidebar) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Cadastro" element={<Cadastro />} />
      <Route path="/Cadastro/Verificacao" element={<Verificacao />} />
      <Route path="/recSenha" element={<RecSenha />} />
      <Route path="/recSenha/Verificacao" element={<Verificacao />} />
      <Route path="/RedefinirSenha" element={<RedefinirSenha />} />

      {/* ROTAS PROTEGIDAS! Com sidebar (LayoutPrincipal) */}
      <Route element={<ProtecaoRota />}>
        <Route element={<LayoutPrincipal />}>
          <Route path="/home" element={<Home />} />
          <Route path="/historico" element={<HistoricoGlicemico />} />
          <Route path="/diario" element={<DiarioAlimentar />} />
          <Route path="/lembretes" element={<Lembretes />} />
          <Route path="/emergencia" element={<NumeroEmergencia />} />
          <Route path="/dicas" element={<DicasEducativas />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;