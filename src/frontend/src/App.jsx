import {Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Cadastro from "./pages/Cadastro";
import Verificacao from './pages/Verificacao';
import Home from './pages/Home';

function App() {
  return (
      <Routes>
        <Route path= "/" element={<Login/>}/>
        <Route path= "/Cadastro" element={<Cadastro/>}/>
        <Route path="/Cadastro/Verificacao" element={<Verificacao/>}/>
        <Route path="/Home" element={<Home/>}/>
      </Routes>
  )
}

export default App;
  