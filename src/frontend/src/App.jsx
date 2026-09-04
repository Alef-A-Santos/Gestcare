

import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Verificacao from './pages/Verificacao';

 function App() {
  return (
      <Routes>
        <Route path= "/" element={<Home/>}/>
        <Route path= "/Cadastro" element={<Cadastro/>}/>
        <Route path= "/Verificacao" element={<Verificacao/>}/>
      </Routes>
  )
}

export default App;
