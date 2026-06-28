function Card({ icon, title, desc }) {
  return (
    <div className="card-dark bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300">

      {icon && (
        <div className="text-green-700 mb-4">
          {icon}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-3">
        {title}
      </h2>

      <p className="text-gray-600 leading-7 whitespace-pre-line">
        {desc}
      </p>

    </div>
  );
}

export default Card;