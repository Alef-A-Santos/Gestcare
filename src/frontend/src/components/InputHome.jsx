import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function InputHome() {
  return (
    <div className="w-full flex flex-col gap-1 justify-center items-center px-4">

      <label className="font-mono text-[15px] text-white font-bold">
        Email:
      </label>

      <div className="relative w-100">
         <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
        <input
          className="border p-2 pl-10 text-center ro  unded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
          type="email"
          placeholder="Digite seu email aqui"
          required
        />
      </div>

      <label className="font-mono text-[15px] mt-5 text-white font-bold">
        Senha:
      </label>

   
      <div className="relative w-100">
        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />

        <input
          className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
          type="password"
          placeholder="Digite sua senha aqui"
          required
        />
      </div>

    </div>
  );
}

export default InputHome;