function Botao({ nome, className, clickHandler, tipo = "submit", children, ...resto }) {
  return (
    <div className="flex justify-center items-center">
      <button type={tipo} className={className} onClick={clickHandler} {...resto}>
        {children ?? nome}
      </button>
    </div>
  );
}
 
export default Botao;