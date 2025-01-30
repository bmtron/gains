import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import { TextInput, Button, Text, List, Menu, Card } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise } from "@/models/exerciseModels";
import CustomDropdown from "../global/CustomDropdown";
import { WeightUnit } from "@/models/weightUnit";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import NotificationModal from "../common/NotificationModal";
import { DB_NAME } from "@/constants/databaseconstants";

const STORAGE_KEY = "@exercise_groups";
const HISTORY_STORAGE_KEY = "@exercise_history";

interface HistoricalExerciseSet {
    exerciseId: number;
    date: Date | undefined;
    weightUnit: WeightUnit;
    weight: number;
    reps: number;
    rpe: number;
    workoutid: number | undefined;
}

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
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
        null
    );
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
                exerciseId: set.exerciseid,
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
                setExercises(data);
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

    const getAllExercisesFromLocal = async (): Promise<Exercise[]> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        const data: any[] = await db.getAllAsync(`SELECT * FROM exercise;`);

        return data.map((exercise) => ({
            exerciseid: exercise.exercise_local_id,
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

    const handleAddExerciseGroupNoButton = async (exerciseId: number) => {
        const selectedExerciseData = exercises.find(
            (ex) => ex.exerciseid === exerciseId
        );
        if (!selectedExerciseData) return;
        if (
            exerciseGroups.find(
                (exercise) =>
                    exercise.exerciseid === selectedExerciseData.exerciseid
            ) !== undefined
        ) {
            const existingExerciseGroup = exerciseGroups.find(
                (exercise) =>
                    exercise.exerciseid === selectedExerciseData.exerciseid
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
        console.log(group.weightUnit);
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
            exerciseid: group?.exerciseid,
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
    const renderExerciseHistory = (exerciseId: number) => {
        const history =
            historicalSets.filter((set) => set.exerciseId === exerciseId) || [];
        if (history.length === 0) {
            return (
                <Card style={{ margin: 8, padding: 8 }}>
                    <Text>No previous workout data available.</Text>
                </Card>
            );
        }
        const mostRecentWorkoutId = Math.max(
            ...history.map((set) => set.workoutid || 0)
        );
        const filteredHistoryItems = history
            .slice(-3)
            .filter((set) => set.workoutid === mostRecentWorkoutId);
        return (
            <View style={{ margin: 8 }}>
                <Text style={{ fontWeight: "bold" }}>
                    {filteredHistoryItems[0].date === undefined
                        ? ""
                        : new Date(
                              filteredHistoryItems[0].date
                          ).toLocaleDateString()}
                </Text>
                <Card style={{ marginBottom: 8, padding: 8 }}>
                    {filteredHistoryItems.map((set, idx) => (
                        <Text key={idx}>
                            Set {idx + 1}: {set.weight}
                            {set.weightUnit.weightunitlabel} x {set.reps} reps
                            {set.rpe ? ` @ RPE ${set.rpe}` : ""}
                        </Text>
                    ))}
                </Card>
            </View>
        );
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
                                exercise.exerciseid
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
                                {renderExerciseHistory(exercise.exerciseid)}
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
