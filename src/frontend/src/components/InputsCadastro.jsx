import Labels from "./Labels";
import Inputs from "./Inputs";

function InputHome() {
  return (
    <div className="flex flex-col gap-1 justify-content items-center">
      <Labels desc="Email" className="text-zinc-700"/>
      <Inputs tipoDado="Email" placeName="Digite aqui seu Email"/>
      
      <Labels desc="Senha" className="text-zinc-700"/>
      <Inputs tipoDado="passWord" placeName="Digite aqui sua senha"/>
    </div>
  );
}

export default InputHome;
