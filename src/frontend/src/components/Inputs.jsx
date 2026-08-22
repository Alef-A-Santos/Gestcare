function Inputs({placeName, tipoDado, className}){
    return(
        <div className="flex flex-col gap-1">
            <input className={className} type={tipoDado} placeholder={placeName} required />
        </div>
    )
}

export default Inputs;