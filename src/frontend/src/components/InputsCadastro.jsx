import Labels from "./Labels";
import Inputs from "./Inputs";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

function InputHome() {
  return (
    <div className="flex justify-center items-center flex-col gap-1">
    
      
      <div className="w-100 flex flex-col justify-center lg:justify-start items-center">
        <Labels desc="Nome" className="text-white font-bold flex justify-center items-center m-1" />
        <Inputs tipoDado="text" placeName="seu nome aqui" className="border-2 p-2 rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-start  text-grey-300 sm:text-center" />
      </div>

      
      <div className="w-100 flex flex-col justify-center lg:justify-start items-center">
      <Labels desc="Email" className="text-white font-bold flex justify-center items-center m-1" />
      <Inputs tipoDado="Email" placeName="seu email aqui" icone={<MdEmail className="absolute  text-teal-500 m-3" />} className="border-2 p-2 rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 pl-9" />
      </div>

      
      <div className=" w-100 flex flex-col justify-center lg:justify-start items-center">
      <Labels desc="Senha" className="text-white font-bold text-start sm:text-center flex justify-center items-center m-1" />
      <Inputs tipoDado="passWord" placeName="Crie sua senha aqui" icone={<FaLock className="absolute  text-teal-500 m-3"/>}
       className="border-2 p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-9" />
      </div>
      
      <div className="flex justify-center items-center">
       <Labels desc="Data da última menstruação" className="text-white font-bold m-1" />
      </div>
      
      
       <Inputs tipoDado="date" placeName="Digite aqui a data da última menstruação" className="border-2 p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-100 outline-none focus:border-red-400 focus:border-2  [&::-webkit-datetime-edit]:text-gray-500" />


     
     
    </div>
  );
}

export default InputHome;
