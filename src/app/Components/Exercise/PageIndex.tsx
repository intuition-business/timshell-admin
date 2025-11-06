import ExerciseCard from "./ExerciseCard";
import ExerciseRow from "./exerciseUsers";

export default function Page() {
  const exercises = [
    {
      image: "https://i.pravatar.cc/100?img=1",
      title: "Extensión de cadera (polea)",
      subtitle: "Sentadilla Smith",
      series: 3,
      rest: "2 minutos",
    },
    {
      image: "https://i.pravatar.cc/100?img=2",
      title: "Prensa",
      subtitle: "Hip thrust máquina",
      series: 3,
      rest: "2 minutos",
    },
    {
      image: "https://i.pravatar.cc/100?img=7",
      title: "Extensiones de rodilla",
      subtitle: "Abducción de cadera máquina",
      series: 3,
      rest: "2 minutos",
    },
    {
      image: "https://i.pravatar.cc/100?img=18",
      title: "Hiperextensiones para glúteo",
      subtitle: "",
      series: 3,
      rest: "2 minutos",
    },
  ];

  return (
    <main className="min-h-screen bg-[#101010]  p-6 space-y-4">
      {exercises.map((ex, i) => (
        <ExerciseCard
          key={i}
          image={ex.image}
          title={ex.title}
          subtitle={ex.subtitle}
          series={ex.series}
          rest={ex.rest}
        />
      ))}

      <div className="flex flex-col gap-4 mt-8 w-[900px] mx-auto">
        <ExerciseRow
          title="Cuádriceps y Glúteo"
          date="3/10/2025"
          status="Completado"
          exercises={[
            "Extensión de cadera (polea)",
            "Hip Thrust Máquina",
            "Sentadilla Smith",
            "Front Squat (Sentadilla frontal)",
            "Prensa",
            "Step-up (Subida a banco)",
          ]}
        />
      </div>
    </main>
  );
}
