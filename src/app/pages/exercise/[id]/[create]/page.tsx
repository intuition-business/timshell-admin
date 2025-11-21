"use client";

import ExerciseCreate from "@/app/Components/Exercise/ExerciseCreate";
import { useSearchParams } from "next/navigation";

export default function ExerciseCreatePage() {
  const searchParams = useSearchParams();
  const exerciseName = searchParams.get("name");
  const series = searchParams.get("series");
  const rest = searchParams.get("rest");
  const image = searchParams.get("image");
  const reps = searchParams.get("reps");

  const date = searchParams.get("date");



  return (
    <div className="w-full relative min-h-full">
      <ExerciseCreate 
        exerciseName={exerciseName}
        seriesCount={series}
        date={date}
        rest={rest}
        image={image}
        reps={reps}
      />
    
    </div>
  );
}