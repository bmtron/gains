type Exercise = {
    exerciseid: number;
    musclegroupid: number;
    exercisename: string;
    notes: string;
    dateadded: Date;
    dateupdated: Date | null;
};

type ExerciseLocal = Exercise & { exerciseLocalId: number };
interface ExerciseDto {
    exerciseLocalId?: number;
    name: string;
    musclegroupid: number;
    notes: string;
}

export { Exercise, ExerciseLocal, ExerciseDto };
