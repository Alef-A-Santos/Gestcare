import UserName from "./UserName";
// import Botao from "./Botao";

function Header() {
  return (
    <div className="flex justify-between">
      <div className="flex items-center justify-center">
        <p className="text-pink-400 text-4xl font-bold mr-2">Olá</p>
        <UserName
          className={"text-pink-400 text-4xl font-bold"}
          nome={"Maria Fonseca"}
        />
      </div>

      <button className="bg-white rounded-2xl m-2 p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-80 focus:outline-none shadow-xl">
        <img
          className="w-10 h-10"
          src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
          alt="imagem icone pdf"
        />
        <p className="p-1 font-semibold">Exportar relatório em PDF</p>
      </button>
    </div>
  );
}

export default Header;
