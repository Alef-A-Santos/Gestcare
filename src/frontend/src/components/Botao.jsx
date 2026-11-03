function Botao({ nome, className, clickHandler, tipoDado, Component, imagem, desc, imgClassName, textClassName }) {
  return (
    <div className="flex justify-center items-center">
      <button className={className} onClick={clickHandler} type={tipoDado}>
        {Component && <Component className="text-3xl" />}
        {imagem && <img className={imgClassName} src={imagem} alt={desc} />}
        <p className={textClassName}>{nome}</p>
      </button>
    </div>
  );
}

export default Botao;