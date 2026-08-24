function InputHome() {
  return (
    <div className="w-full flex flex-col gap-1 justify-center items-center px-4">
      
      <label className="font-mono text-[15px] text-white font-bold">
        Email:
      </label>

      <input
        className="border p-2 text-center rounded-lg bg-white border-red-300 w-full max-w-100 focus:outline-none"
        type="email"
        placeholder="Digite seu email aqui"
        required
      />

      <label className="font-mono text-[15px] mt-5 text-white font-bold">
        Senha:
      </label>

      <input
        className="border p-2 text-center rounded-lg bg-white border-red-300 w-full max-w-100 focus:outline-none"
        type="password"
        placeholder="Digite sua senha aqui"
        required
      />

    </div>
  );
}

export default InputHome;