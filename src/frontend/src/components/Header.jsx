function Header({ component, titulo, aoExportar, component2 }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <div className="flex flex-wrap items-center gap-x-2">
        <h2 className="text-pink-400 text-3xl sm:text-4xl font-bold">{titulo}</h2>
        {component}

        {aoExportar}
      </div>
      {component2}
    </div>
  );
}

export default Header;