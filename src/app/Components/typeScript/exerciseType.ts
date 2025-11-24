// typado de  ExerciseCard
export interface ExerciseCardProps {
  image?: string;
  title?: string;
  date?:string;
  subtitle?: string;
  series?: number;
  rest?: string;
  idExerciseProps?: string;
  rutina_id?: string;
  fecha_rutina?:string
  update?: any;
}
// typado de exerciseUser
export interface ExerciseUsersProps {
  key?: any;
  id?: number; // ← obligatorio
  date?: string;
  title?: string;
  exercises?: string[];
  ruiner?: string[];
  status?: string;
}
