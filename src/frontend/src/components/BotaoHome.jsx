function Botao ({nome, className, clickHandler}){
    return(
        <div className="flex justify-center items-center">
            <button className={className} onClick={clickHandler}>{nome}</button>
        </div>
    )
}

export default Botao