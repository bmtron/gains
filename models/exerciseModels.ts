interface Exercise {
    exerciseId: number;
    musclegroupid: number;
    name: string;
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
