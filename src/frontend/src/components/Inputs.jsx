function Inputs({icone, placeName, tipoDado, className}){
    return(
        <div className="relative flex flex-col gap-1">
            {icone}
            <input className={className} type={tipoDado} placeholder={placeName} required />
        </div>
    )
}

export default Inputs;