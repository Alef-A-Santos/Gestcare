function CardInfo({UltimaAfericao, nivel, estado, data, horario, className }){
    return(
        <div>
            <div className="bg-white p-4 m-1 rounded-2xl shadow border-2 border-teal-500">
            <h2 className="text-3xl font-poppins m-1 mb-3">Ultima medição</h2>
            <h3 className="text-3xl m-1 text-teal-500 text-center font-bold">{UltimaAfericao}</h3>
            <div className="flex gap-3 m-1 p-1 justify-center items-center">
              <div className="py-2">
                <p className={className}> • {nivel}</p>
              </div>
             
              <p className="text-2xl text-zinc-400 font-poppins">{estado}</p>
            </div>
            <div className="flex gap-3 justify-center items-center text-zinc-500">
              <p className="text-[16px] font-poppins">{data}</p>
              <p className="text-[16px] font-poppins">{horario}</p>
            </div>
          </div>
        </div>
    )
}

export default CardInfo;
