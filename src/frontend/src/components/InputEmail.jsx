
function InputEmail() {
  return (
    <input
      type="text" required
      maxLength={1}
      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg outline-none focus:border-red-400 bg-white"
    />
  );
}

export default InputEmail;

