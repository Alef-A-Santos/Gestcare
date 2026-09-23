function Inputs({icone,placeName,tipoDado,className,icone2,onInput,value,onChange,}) {
  return (
    <div className="relative flex flex-col gap-1">
      {icone}
      {icone2}
      <input className={className} type={tipoDado} placeholder={placeName} value={value} onChange={onChange} onInput={onInput}
      />
    </div>
  );
}

export default Inputs;
