function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

      <p className="mt-4 text-gray-600 font-medium">
        {text}
      </p>
    </div>
  );
}

export default Loader;