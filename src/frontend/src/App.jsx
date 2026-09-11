import {Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
      <Routes>
        <Route path= "/" element={<Login/>}/>
        <Route path= "/Cadastro" element={<Cadastro/>}/>
        <Route path= "/Cadastro" element={<Cadastro/>}/>
      </Routes>
  )
}

export default App;
