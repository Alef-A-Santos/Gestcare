function Botao ({nome, className}){
    return(
        <div className="flex justify-center items-center">
            <button className={className}>{nome}</button>
        </div>
    )
}

export default Botao