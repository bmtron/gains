import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import { TextInput, Button, List, Menu } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise, ExerciseLocal } from "@/models/exerciseModels";
import CustomDropdown from "../global/CustomDropdown";
import { WeightUnit } from "@/models/weightUnit";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import NotificationModal from "../common/NotificationModal";
import { DB_NAME } from "@/constants/databaseconstants";
import HistoricalExerciseSet from "@/models/historicalExerciseSet";
import ExerciseHistory from "./ExerciseHistory";

interface ExerciseGroupListProps {
    onGroupsChange?: (groups: ExerciseGroup[]) => void;
    clearOldData: boolean;
}
const ExerciseGroupList = ({
    onGroupsChange,
    clearOldData,
}: ExerciseGroupListProps) => {
    const theme = useAppTheme();

    const [exerciseGroups, setExerciseGroups] = useState<ExerciseGroup[]>([]);
    const [exercises, setExercises] = useState<ExerciseLocal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] =
        useState<ExerciseLocal | null>(null);
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState("");
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [weightUnits, setWeightUnits] = useState<WeightUnit[]>([]);
    const [weightUnitMenuVisible, setWeightUnitMenuVisible] = useState(false);
    const [historicalSets, setHistoricalSets] = useState<
        HistoricalExerciseSet[]
    >([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    const [exercisesLoaded, setExercisesLoaded] = useState(false);
    const [groupsLoaded, setGroupsLoaded] = useState(false);
    const [weightUnitsLoaded, setWeightUnitsLoaded] = useState(false);
    const [weightInputValue, setWeightInputValue] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("NO_MESSAGE_SET_");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await loadExercises();
                setExercisesLoaded(true);
            } catch (error) {
                console.error("Error loading exercises:", error);
            }
        };
        loadInitialData();
    }, []);

    // Second useEffect - Load groups after exercises
    useEffect(() => {
        if (!exercisesLoaded) return;

        const loadGroupData = async () => {
            try {
                await loadGroups();
                setGroupsLoaded(true);
            } catch (error) {
                console.error("Error loading groups:", error);
            }
        };
        loadGroupData();
    }, [exercisesLoaded]);

    // Third useEffect - Load weight units after groups
    useEffect(() => {
        if (!groupsLoaded) return;

        const loadWeightData = async () => {
            try {
                await loadWeightUnits();
                setWeightUnitsLoaded(true);
            } catch (error) {
                console.error("Error loading weight units:", error);
            }
        };
        loadWeightData();
    }, [groupsLoaded]);

    // Final useEffect - Load historical workouts after all other data
    useEffect(() => {
        if (!weightUnitsLoaded) return;

        const loadHistoryData = async () => {
            try {
                await loadHistoricalWorkouts();
                setLoading(false);
                await clearOldDataTask();
            } catch (error) {
                console.error("Error loading history:", error);
            }
        };
        loadHistoryData();
    }, [weightUnitsLoaded]);

    const clearOldDataTask = async () => {
        if (clearOldData) {
            setExerciseGroups([]);
            setExercises([]);
            /* SQLITE IMPLEMENTATION? */
        }
    };

    const loadGroups = async () => {
        try {
            /*
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setExerciseGroups(JSON.parse(stored));
            }*/
            // SQLITE IMPLEMENTATION?
        } catch (error) {
            console.error("Error loading groups:", error);
        }
    };

    const saveExerciseGroups = async (updatedGroups: ExerciseGroup[]) => {
        try {
            /*await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedGroups)
            ); */
            //SQLITE IMPLEMENTATION?
        } catch (error) {
            console.error("Error saving groups:", error);
        }
    };

    const loadHistoricalWorkouts = async () => {
        try {
            const data = await getAllItems<ExerciseSetDto[]>(
                "/exerciseset/dto"
            );
            setHistoricalSets(mapSetsToHistoricalSets(data));
        } catch (error) {
            console.error("Error loading exercise sets:", error);
        } finally {
            setLoading(false);
        }
    };
    const mapSetsToHistoricalSets = (
        data: ExerciseSetDto[]
    ): HistoricalExerciseSet[] => {
        const result = data.map((set) => {
            const weightUnit = weightUnits.find(
                (w) => w.weightunitlookupid === set.weightunitlookupid
            );
            const temp: HistoricalExerciseSet = {
                workoutid: set.workoutid,
                exerciseId: set.exerciseserverid,
                date: set.dateadded,
                weight: set.weight,
                weightUnit: weightUnits.filter(
                    (w) => w.weightunitlookupid === set.weightunitlookupid
                )[0],
                reps: set.repetitions,
                rpe: set.estimatedrpe,
            };

            return temp;
        });
        return result;
    };
    const loadExercises = async () => {
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
            } finally {
                setLoading(false); // do i even use this?
            }
        } else {
            try {
                const data = await getAllExercisesFromLocal();
                setExercises(data);
            } catch (error) {
                console.error("Error loading exersises from local:", error);
            } finally {
                setLoading(false); // do i even use this?
            }
        }
    };

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
    const loadWeightUnits = async () => {
        try {
            const data = await getAllItems<WeightUnit[]>("/weightunit");
            setWeightUnits(data);
        } catch (error) {
            console.error("Error loading weight units:", error);
        }
    };

    const handleAddExerciseGroupNoButton = async (exerciseLocalId: number) => {
        const selectedExerciseData = exercises.find(
            (ex) => ex.exerciseLocalId === exerciseLocalId
        );
        if (!selectedExerciseData) return;
        if (
            exerciseGroups.find(
                (exercise) =>
                    exercise.exerciselocalid ===
                    selectedExerciseData.exerciseLocalId
            ) !== undefined
        ) {
            const existingExerciseGroup = exerciseGroups.find(
                (exercise) =>
                    exercise.exerciselocalid ===
                    selectedExerciseData.exerciseLocalId
            );
            if (existingExerciseGroup !== undefined) {
                setExpandedGroup(existingExerciseGroup.name);
            }

            return;
        }
        const defaultWeightUnit = weightUnits.find(
            (w) => w.weightunitname === "pounds"
        );

        const updatedExerciseGroups = [
            ...exerciseGroups,
            {
                exerciseid: selectedExerciseData.exerciseid,
                exerciselocalid: selectedExerciseData.exerciseLocalId,
                name: selectedExerciseData.exercisename,
                sets: [],
                weightUnit: defaultWeightUnit,
            },
        ];

        if (onGroupsChange) {
            onGroupsChange(updatedExerciseGroups);
        }
        setExerciseGroups(updatedExerciseGroups);
        await saveExerciseGroups(updatedExerciseGroups);
        setSelectedExercise(null);
    };

    const handleRemoveSet = async (index: number, group: ExerciseGroup) => {
        const updatedExerciseGroups = exerciseGroups.map((g) =>
            g.name === group.name
                ? { ...g, sets: g.sets.filter((_, i) => i !== index) }
                : g
        );
        if (onGroupsChange) {
            onGroupsChange(updatedExerciseGroups);
        }
        setExerciseGroups(updatedExerciseGroups);
        await saveExerciseGroups(updatedExerciseGroups);
    };

    const handleAddSet = async (groupName: string) => {
        const group = exerciseGroups.find((g) => g.name === groupName);
        if (group === undefined) return;
        if (!group.weightUnit) {
            setModalVisible(true);
            setModalMessage(
                "You have not selected a weight unit. Please make a valid selection."
            );
            return;
        }
        if (!weight) {
            setModalVisible(true);
            setModalMessage("You must select a value for weight to continue.");
            return;
        }
        if (!reps) {
            setModalVisible(true);
            setModalMessage("You must select a value for reps to continue");
            return;
        }
        const newSet: ExerciseSetDto = {
            exerciselocalid: group?.exerciselocalid,
            exerciseserverid: group?.exerciseid,
            weight: parseFloat(weight),
            repetitions: parseInt(reps),
            estimatedrpe: rpe ? parseFloat(rpe) : 0,
            weightunitlookupid:
                group.weightUnit !== undefined
                    ? group.weightUnit.weightunitlookupid
                    : 0,
        };

        const updatedGroups = exerciseGroups.map((group) =>
            group.name === groupName
                ? {
                      ...group,
                      sets: [...group.sets, newSet],
                  }
                : group
        );

        setExerciseGroups(updatedGroups);

        await saveExerciseGroups(updatedGroups);

        if (onGroupsChange) {
            onGroupsChange(updatedGroups);
        }
        setWeight("");
        setReps("");
        setRpe("");
    };
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <NotificationModal
                isVisible={modalVisible}
                setModalVisibile={setModalVisible}
                message={modalMessage}
            />
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.colors.background }}
            >
                <View style={{ padding: 16 }}>
                    <CustomDropdown
                        options={exercises}
                        onSelect={async (exercise) => {
                            await handleAddExerciseGroupNoButton(
                                exercise.exerciseLocalId
                            );
                            setExpandedGroup(exercise.exercisename);
                        }}
                        selectedOption={selectedExercise}
                        placeholder='Select Exercise'
                    />

                    {exerciseGroups.map((exercise) => (
                        <List.Accordion
                            key={exercise.name}
                            title={`${exercise.name} ${
                                exercise.weightUnit
                                    ? `(${exercise.weightUnit.weightunitlabel})`
                                    : ""
                            }`}
                            expanded={expandedGroup === exercise.name}
                            onPress={() =>
                                setExpandedGroup(
                                    expandedGroup === exercise.name
                                        ? null
                                        : exercise.name
                                )
                            }
                        >
                            {/* Add Historical Performance Section */}
                            <List.Accordion
                                title='Previous Workout Data'
                                expanded={showHistory}
                                onPress={() => setShowHistory(!showHistory)}
                            >
                                <ExerciseHistory
                                    exerciseId={exercise.exerciseid}
                                    historicalSets={historicalSets}
                                />
                            </List.Accordion>
                            <Menu
                                visible={weightUnitMenuVisible}
                                theme={theme}
                                onDismiss={() => {
                                    setExerciseGroups(exerciseGroups);
                                    setWeightUnitMenuVisible(false);
                                }}
                                anchor={
                                    <Button
                                        onPress={() => {
                                            setWeightUnitMenuVisible(true);
                                        }}
                                    >
                                        {exercise.weightUnit?.weightunitname ||
                                            "Select Weight Unit"}
                                    </Button>
                                }
                            >
                                {weightUnits.map((unit) => (
                                    <Menu.Item
                                        key={unit.weightunitlookupid}
                                        onPress={() => {
                                            const updatedGroups =
                                                exerciseGroups.map((g) =>
                                                    g.name === exercise.name
                                                        ? {
                                                              ...g,
                                                              weightUnit: unit,
                                                          }
                                                        : g
                                                );
                                            setExerciseGroups(updatedGroups);
                                            setWeightUnitMenuVisible(false);
                                        }}
                                        title={unit.weightunitname}
                                    />
                                ))}
                            </Menu>

                            {exercise.sets.map((set, index) => (
                                <List.Item
                                    key={index}
                                    title={`Set ${index + 1}`}
                                    description={`Weight: ${set.weight}${
                                        exercise.weightUnit?.weightunitlabel ||
                                        ""
                                    }, Reps: ${set.repetitions}${
                                        set.estimatedrpe
                                            ? `, RPE: ${set.estimatedrpe}`
                                            : ""
                                    }`}
                                    right={(props) => (
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleRemoveSet(index, exercise)
                                            }
                                        >
                                            <List.Icon
                                                {...props}
                                                icon='delete'
                                            />
                                        </TouchableOpacity>
                                    )}
                                />
                            ))}

                            <View style={{ padding: 8 }}>
                                <List.Accordion title='New Set...'>
                                    <TextInput
                                        placeholder={
                                            "Weight (" +
                                            exercise.weightUnit
                                                ?.weightunitlabel +
                                            ")"
                                        }
                                        value={weight}
                                        keyboardType='numeric'
                                        textContentType='none'
                                        onChangeText={(text) => setWeight(text)}
                                        style={{ marginBottom: 8 }}
                                    />
                                    <TextInput
                                        label='Repetitions'
                                        value={reps}
                                        onChangeText={setReps}
                                        keyboardType='numeric'
                                        style={{ marginBottom: 8 }}
                                    />
                                    <TextInput
                                        label='RPE (optional)'
                                        value={rpe}
                                        onChangeText={setRpe}
                                        keyboardType='numeric'
                                        style={{ marginBottom: 8 }}
                                    />
                                </List.Accordion>
                                <Button
                                    mode='contained'
                                    onPress={() => handleAddSet(exercise.name)}
                                >
                                    Add Set
                                </Button>
                            </View>
                        </List.Accordion>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ExerciseGroupList;
