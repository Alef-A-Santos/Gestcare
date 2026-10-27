
import { forwardRef } from "react";


const InputEmail = forwardRef(function InputEmail(
  { valor, onChange, onKeyDown },
  ref
) {

  return (

    <input

      ref={ref}

      type="text"

      value={valor}

      required

      maxLength={1}

      inputMode="numeric"

      onChange={(e) => {

        const numero =
          e.target.value.replace(/\D/g, "");

        onChange(numero);

      }}

      onKeyDown={onKeyDown}

      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg outline-none focus:border-red-400 bg-white"

    />

  );

});


export default InputEmail;
