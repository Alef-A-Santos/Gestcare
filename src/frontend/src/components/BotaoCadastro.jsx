function Botao ({nome, className, clickHandler, tipoDado}){
    return(
        <div className="flex justify-center items-center">
            <button className={className} onClick={clickHandler} type={tipoDado}>{nome}</button>
        </div>
    )
}

export default Botao