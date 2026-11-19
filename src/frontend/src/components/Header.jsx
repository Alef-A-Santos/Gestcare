function Header({ component, titulo, aoExportar, component2 }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <div className="flex flex-wrap jus items-center gap-x-3 my-5">
        <h2 className="font-playfair text-pink-400 text-5xl font-bold text-shadow-[1px_1px_2px] text-shadow-pink-400">{titulo}</h2>
        {component}

        {aoExportar}
      </div>
      {component2}
    </div>
  );
}

export default Header;