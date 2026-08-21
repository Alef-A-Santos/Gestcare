function Inputs({placeName, tipoDado}){
    return(
        <div className="flex flex-col gap-1">
            <input className="border p-2 text-center rounded-lg bg-white border-red-300 w-110" type={tipoDado} placeholder={placeName} required />
        </div>
    )
}

export default Inputs;