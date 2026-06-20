/**
 * Loader Component
 *
 * Displays a loading spinner.
 */

function Loader() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;