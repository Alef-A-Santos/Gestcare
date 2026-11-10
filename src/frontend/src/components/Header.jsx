function Header({ component, titulo, aoExportar, component2 }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <div className="flex flex-wrap items-center gap-x-3 my-5">
        <h2 className="font-[Playfair_Display] text-pink-400 text-5xl font-bold">{titulo}</h2>
        {component}

        {aoExportar}
      </div>
      {component2}
    </div>
  );
}

export default Header;