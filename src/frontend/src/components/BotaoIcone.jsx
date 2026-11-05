function BotaoIcone({ icone, rotulo, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`p-2 rounded-lg text-gray-500 cursor-pointer transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${className}`}
    >
      {icone}
    </button>
  );
}

export default BotaoIcone;