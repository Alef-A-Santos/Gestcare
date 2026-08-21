function InputHome() {
  return (
    <div className="w-full flex flex-col gap-1 justify-center ">
      
        <label className="font-mono text-[15px]  ">
          Email:
        </label>
        <input
          className="border p-2 text-center rounded-lg bg-white"
          type="email"
          placeholder="Digite seu email aqui"
          required
        />

        <label className="font-mono text-[15px] mt-5 ">
          Senha:
        </label>
        <input
          className="border p-2 text-center rounded-lg bg-white"
          type="password"
          placeholder="Digite sua senha aqui"
          required
        />

    </div>
  );
}

export default InputHome;
