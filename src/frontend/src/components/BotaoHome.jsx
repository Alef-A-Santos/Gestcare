function Botao ({nome, className, clickHandler, tipo="submit"}){
    return(
        <div className="flex justify-center items-center">
            <button type={tipo} className={className} onClick={clickHandler}>{nome}</button>
        </div>
    )
}

export default Botao