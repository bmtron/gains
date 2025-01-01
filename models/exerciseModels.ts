interface Exercise {
    exerciseId: number;
    musclegroupid: number;
    exercisename: string;
    notes: string;
    dateAdded: Date;
    dateUpdated: Date | null;
}

interface ExerciseDto {
    name: string;
    musclegroupid: number;
    notes: string;
}

export { Exercise, ExerciseDto };
