function Botao({ nome, className, clickHandler, tipoDado, Component }) {
  return (
    <div className="flex justify-center items-center">
      <button className={className} onClick={clickHandler} type={tipoDado}>
        {Component && <Component className="text-3xl" />}
        <p>{nome}</p>
        
      </button>
    </div>
  );
}

export default Botao;