function Botao ({nome, className, clickHandler, tipoDado,Component}){
    return(
        <div className="flex justify-center items-center">
            <button className={className} onClick={clickHandler} type={tipoDado}>{nome}{Component}</button>
        </div>
    )
}

export default Botao