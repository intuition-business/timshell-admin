"use client";

import ExerciseCreate from "@/app/Components/Exercise/ExerciseCreate";
import { useSearchParams } from "next/navigation";

export default function ExerciseCreatePage() {
  const searchParams = useSearchParams();
  const exerciseName = searchParams.get("name");

  return (
    <div className="w-full relative min-h-full">
      <ExerciseCreate exerciseName={exerciseName} />
    </div>
  );
}