import Labels from "./Labels";
import Inputs from "./Inputs";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";

function InputHome() {
  return (
    <div className="flex justify-center items-center flex-col gap-1 overflow-y-hidden">
      <div className="w-100 flex flex-col justify-center items-center">
        <Labels
          desc="Nome"
          className="text-white font-bold flex justify-start items-center m-1 pl-2 "
        />
        <Inputs
          tipoDado="text"
          placeName="seu nome aqui"
          icone={<VscAccount className="absolute text-teal-500 m-4 " />}
          className="border-2 p-2 rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-start  text-grey-300 pl-9"
        />
      </div>

      <div className="w-96 flex flex-col justify-center lg:justify-start items-center">
        <Labels
          desc="Email"
          className="text-white font-bold flex justify-start items-center m-1 pl-2"
        />
        <Inputs
          tipoDado="Email"
          placeName="seu email aqui"
          icone={<MdEmail className="absolute  text-teal-500 m-4" />}
          className="border-2 p-2 rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 pl-9"
        />
      </div>

      <div className=" w-96 flex flex-col justify-center lg:justify-start items-center">
        <Labels
          desc="Senha"
          className="text-white font-bold sm:text-center flex justify-start items-center m-1 pl-2"
        />
        <Inputs
          tipoDado="passWord"
          placeName="Crie sua senha aqui"
          icone={<FaLock className="absolute  text-teal-500 m-4" />}
          className="border-2 p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-9"
        />
      </div>

      <div className="w-96 flex flex-col justify-center lg:justify-start items-center">
        <Labels
          desc="Data da última menstruação"
          className="text-white font-bold m-1 flex justify-start items-center pl-2 mb-1"
        />
        <Inputs
          tipoDado="date"
          placeName="Digite aqui a data da última menstruação"
          icone={
            <MdCalendarMonth className="absolute text-teal-500 m-4 text-end" />
          }
          className="border-2 p-2 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none  focus:border-red-400  focus:border-2    text-gray-500   pl-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>
    </div>
  );
}

export default InputHome;
