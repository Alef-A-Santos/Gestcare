import {Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Cadastro from "./pages/Cadastro";
import Verificacao from './pages/Verificacao';

function App() {
  return (
      <Routes>
        <Route path= "/" element={<Login/>}/>
        <Route path= "/Cadastro" element={<Cadastro/>}/>
        <Route path="/Cadastro/Verificacao" element={<Verificacao/>}/>

      </Routes>
  )
}

export default App;
  