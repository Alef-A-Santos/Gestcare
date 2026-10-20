function Botao ({nome, className, clickHandler, tipoDado, Component, children}){
    return(
        <div className="flex justify-center items-center">
                <button className={className} onClick={clickHandler} type={tipoDado} >{nome} {Component}{children} </button>
        </div>
    )
}

export default Botao