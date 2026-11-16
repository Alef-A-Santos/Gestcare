function Inputs({icone,placeName,tipoDado,className,icone2,onInput,value,onChange,name, accept, max}) {
  return (
    <div className="relative flex flex-col gap-1">
      {icone}
      {icone2}
      <input className={className} name={name} type={tipoDado} placeholder={placeName} value={value} onChange={onChange} accept={accept} onInput={onInput} max={max}
      />
    </div>
  );
}

export default Inputs;
