import { DB_NAME } from "@/constants/databaseconstants";
import getAllItems from "@/data/functions/getAllItems";
import { databaseOperations } from "@/data/localstorage/databaseOperations";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { Exercise, ExerciseLocal } from "@/models/exerciseModels";
import {
    ExerciseSetDto,
    mapSetsToHistoricalSets,
} from "@/models/exerciseSetDto";
import HistoricalExerciseSet from "@/models/historicalExerciseSet";
import { WeightUnit } from "@/models/weightUnit";
import { Platform } from "react-native";

const getAllExercisesFromLocal = async (): Promise<ExerciseLocal[]> => {
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    const data: any[] = await db.getAllAsync(`SELECT * FROM exercise;`);

    return data.map((exercise) => ({
        exerciseLocalId: exercise.exercise_local_id,
        exerciseid: exercise.exercise_server_id,
        musclegroupid: exercise.muscle_group_id,
        exercisename: exercise.exercise_name,
        notes: exercise.notes,
        dateadded: exercise.date_added,
        dateupdated: null,
    }));
};

export const loadExercises = async (
    setExercises: (arg0: ExerciseLocal[]) => void
) => {
    if (Platform.OS === "web") {
        try {
            const data = await getAllItems<Exercise[]>("/exercise");
            const localMap: ExerciseLocal[] = data.map((e) => {
                return {
                    exerciseLocalId: e.exerciseid, // this could potentially cause problems...that I'm too tired to think of right now
                    exerciseid: e.exerciseid,
                    musclegroupid: e.musclegroupid,
                    exercisename: e.exercisename,
                    notes: e.notes,
                    dateadded: e.dateadded,
                    dateupdated: null,
                };
            });
            setExercises(localMap);
        } catch (error) {
            console.error("Error loading exercises:", error);
        }
    } else {
        try {
            const data = await getAllExercisesFromLocal();
            setExercises(data);
        } catch (error) {
            console.error("Error loading exersises from local:", error);
        }
    }
};

export const loadWeightUnitsFromLocal = async (
    setWeightUnits: (arg0: WeightUnit[]) => void
) => {
    try {
        const data = await databaseOperations.getAllWeightUnitLookups();
        setWeightUnits(data);
    } catch (error) {
        console.log("Error setting weight units: " + error);
    }
};

export const loadHistoricalWorkouts = async (
    weightUnits: WeightUnit[],
    setHistoricalSets: (arg0: HistoricalExerciseSet[]) => void
) => {
    try {
        const data = await getAllItems<ExerciseSetDto[]>("/exerciseset/dto");
        setHistoricalSets(mapSetsToHistoricalSets(data, weightUnits));
    } catch (error) {
        console.error("Error loading exercise sets:", error);
    }
};
export interface AddExerciseGroupProps {
    exerciseLocalId: number;
    exercises: ExerciseLocal[];
    exerciseGroups: ExerciseGroup[];
    setExpandedGroup: (arg0: string) => void;
    weightUnits: WeightUnit[];
    onGroupsChange?: (arg0: ExerciseGroup[]) => void;
    setExerciseGroups: (arg0: ExerciseGroup[]) => void;
    setSelectedExercise: (arg0: ExerciseLocal | null) => void;
}
export const handleAddExerciseGroup = async (props: AddExerciseGroupProps) => {
    const selectedExerciseData = props.exercises.find(
        (ex) => ex.exerciseLocalId === props.exerciseLocalId
    );
    if (!selectedExerciseData) return;
    if (
        props.exerciseGroups.find(
            (exercise) =>
                exercise.exerciselocalid ===
                selectedExerciseData.exerciseLocalId
        ) !== undefined
    ) {
        const existingExerciseGroup = props.exerciseGroups.find(
            (exercise) =>
                exercise.exerciselocalid ===
                selectedExerciseData.exerciseLocalId
        );
        if (existingExerciseGroup !== undefined) {
            props.setExpandedGroup(existingExerciseGroup.name);
        }

        return;
    }
    const defaultWeightUnit = props.weightUnits.find(
        (w) => w.weightunitname === "pounds"
    );

    const updatedExerciseGroups = [
        ...props.exerciseGroups,
        {
            exerciseid: selectedExerciseData.exerciseid,
            exerciselocalid: selectedExerciseData.exerciseLocalId,
            name: selectedExerciseData.exercisename,
            sets: [],
            weightUnit: defaultWeightUnit,
        },
    ];

    if (props.onGroupsChange) {
        props.onGroupsChange(updatedExerciseGroups);
    }
    props.setExerciseGroups(updatedExerciseGroups);
    props.setSelectedExercise(null);
};

export interface RemoveExerciseSetProps {
    index: number;
    group: ExerciseGroup;
    exerciseGroups: ExerciseGroup[];
    onGroupsChange?: (arg0: ExerciseGroup[]) => void;
    setExerciseGroups: (arg0: ExerciseGroup[]) => void;
}

export const handleRemoveExerciseSet = async (
    props: RemoveExerciseSetProps
) => {
    const updatedExerciseGroups = props.exerciseGroups.map((g) =>
        g.name === props.group.name
            ? { ...g, sets: g.sets.filter((_, i) => i !== props.index) }
            : g
    );
    if (props.onGroupsChange) {
        props.onGroupsChange(updatedExerciseGroups);
    }
    props.setExerciseGroups(updatedExerciseGroups);
};

export interface RemoveExerciseProps {
    group: ExerciseGroup;
    exerciseGroups: ExerciseGroup[];
    onGroupsChange?: (arg0: ExerciseGroup[]) => void;
    setExerciseGroups: (arg0: ExerciseGroup[]) => void;
}
export const handleRemoveExercise = async (props: RemoveExerciseProps) => {
    const updatedExerciseGroups = props.exerciseGroups.filter(
        (g) => g.name !== props.group.name
    );

    console.log(updatedExerciseGroups);

    if (props.onGroupsChange) {
        props.onGroupsChange(updatedExerciseGroups);
    }
    props.setExerciseGroups(updatedExerciseGroups);
};
