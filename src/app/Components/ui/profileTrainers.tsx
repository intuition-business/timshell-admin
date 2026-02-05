"use client";

interface TrainerInfoCardProps {
  name: string;
  image?: string;
  specialty?: string;
  price?: number | string;
  rating?: number | string;
  description?: string;
}

export default function TrainerInfoCard({
  name,
  image,
  specialty,
  price = "$120.000",
  rating,
  description,
}: TrainerInfoCardProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 items-center">

        {/* Imagen */}
        <div className="relative">
          <img
            src={image || "/default-avatar.png"}
            alt={name}
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>

        {/* Información */}
        <div className="text-white space-y-4">

          <h2 className="text-3xl font-bold text-[#dff400]">
            {name}
          </h2>

          <p className="text-gray-300 text-sm">
            {specialty}
          </p>

          {/* Precio + Rating */}
          <div className="flex items-center gap-4 mt-4">
            <p className="text-2xl font-bold">{price}</p>

            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-full">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>

          {/* Descripción */}
          {description && (
            <div className="pt-2">
              <h4 className="font-semibold mb-1">Descripción</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
