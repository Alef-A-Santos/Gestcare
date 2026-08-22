import Labels from "./Labels";
import Inputs from "./Inputs";

function InputHome() {
  return (
    <div className="flex flex-col gap-1 justify-content items-center">
      <Labels desc="NOME" className="text-white font-bold" />
      <Inputs tipoDado="text" placeName="seu nome aqui" className="border p-2 text-center rounded-lg bg-white border-red-300 w-100 outline-none  focus:border-red-400 focus:border-2 text-center" />

      <Labels desc="EMAIL" className="text-white font-bold" />
      <Inputs tipoDado="Email" placeName="seu email aqui" className="border p-2 text-center rounded-lg bg-white border-red-300 w-100 outline-none  focus:border-red-400 focus:border-2 text-center" />

      <Labels desc="SENHA" className="text-white font-bold" />
      <Inputs tipoDado="passWord" placeName="Crie sua senha aqui" className="border p-2 text-center rounded-lg bg-white border-red-300 w-100 outline-none  focus:border-red-400 focus:border-2 text-center" />

      {/* <Labels desc="DATA DA ULTIMA MENSTRUAÇÃO" className="text-white font-bold" /> 
      <Inputs tipoDado="date" placeName="Digite aqui a data da última menstruação" className="border p-2 text-center rounded-lg bg-white border-red-300 w-100 outline-none  focus:border-red-400 focus:border-2 text-center" />*/}
    </div>
  );
}

export default InputHome;
