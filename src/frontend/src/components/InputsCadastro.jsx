import Labels from "./Labels";
import Inputs from "./Inputs";

function InputHome() {
  return (
    <div className="flex flex-col gap-1 justify-center items-start text-start">
      <Labels desc="Nome" className="text-white font-bold" />
      <Inputs tipoDado="text" placeName="seu nome aqui" className="border p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 " />

      <Labels desc="Email" className="text-white font-bold" />
      <Inputs tipoDado="Email" placeName="seu email aqui" className="border p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300" />

      <Labels desc="Senha" className="text-white font-bold" />
      <Inputs tipoDado="passWord" placeName="Crie sua senha aqui" className="border p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-center text-grey-300" />

      <Labels desc="Data da última menstruação" className="text-white font-bold" />
      <Inputs tipoDado="date" placeName="Digite aqui a data da última menstruação" className="border p-2 text-center rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-center [&::-webkit-datetime-edit]:text-gray-500" />
    </div>
  );
}

export default InputHome;
