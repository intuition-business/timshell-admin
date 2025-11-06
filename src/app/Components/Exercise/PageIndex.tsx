import ExercisePage from "./ExercisePage";

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
  //ARRAY DE OBJETOS PARA TABLA EXERCISE
  const exercises2 = [
    {
      id: 1,
      title: "Bíceps",
      date: "3 oct",
      status: "Fallida",
      exercises: [
        "Curl de bíceps alternado",
        "Curl concentrado",
        "Curl tipo martillo",
      ],
      ruiner: [
        "Extensión de cadera (polea)",
        "Hip Thrust Máquina",
        "Sentadilla Smith",
      ],
    },

    {
      id: 2,
      title: "Cuádriceps y Glúteo",
      date: "3 oct",
      status: "Completado",
      exercises: [
        "Extensión de cadera (polea)",
        "Hip Thrust Máquina",
        "Sentadilla Smith",
      ],
      ruiner: [
        "Extensión de cadera (polea)",
        "Hip Thrust Máquina",
        "Sentadilla Smith",
      ],
    },
  ];
  return (
    <main className="min-h-screen bg-[#101010]  p-6 space-y-4">
      {/* {exercises.map((ex, i) => (
        <ExerciseCard
          key={i}
          image={ex.image}
          title={ex.title}
          subtitle={ex.subtitle}
          series={ex.series}
          rest={ex.rest}
        />
      ))}

      <div className="flex flex-col gap- mt-8 w-full mx-auto">
        {exercises2.map((item) => (
          <ExerciseUser
            key={item.id}
            id={item.id}
            title={item.title}
            date={item.date}
            status={item.status}
            exercises={item.exercises}
            ruiner={item.ruiner}
          />
        ))}
      </div> */}
      <ExercisePage />
    </main>
  );
}
