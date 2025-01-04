type Exercise = {
    exerciseid: number;
    musclegroupid: number;
    exercisename: string;
    notes: string;
    dateadded: Date;
    dateupdated: Date | null;
};

interface ExerciseDto {
    name: string;
    musclegroupid: number;
    notes: string;
}

export { Exercise, ExerciseDto };
