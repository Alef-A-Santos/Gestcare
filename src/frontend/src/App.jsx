import {Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Cadastro from "./pages/Cadastro";
import Verificacao from './pages/Verificacao';
import RecSenha from './pages/recSenha';


function App() {
  return (
      <Routes>
        <Route path= "/" element={<Login/>}/>
        <Route path= "/Cadastro" element={<Cadastro/>}/>
        <Route path="/Cadastro/Verificacao" element={<Verificacao/>}/>
        <Route path="/recSenha" element={<RecSenha/>}/>
        <Route path="/recSenha/Verificacao" element={<Verificacao/>}/>
        <Route path="/login" element={<Login/>}/>
        

      </Routes>
  )
}

export default App;
  