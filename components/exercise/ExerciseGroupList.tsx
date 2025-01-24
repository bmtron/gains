import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";
import { TextInput, Button, Text, List, Menu, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/app/_layout";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise } from "@/models/exerciseModels";
import CustomDropdown from "../global/CustomDropdown";
import { WeightUnit } from "@/models/weightUnit";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { ExerciseSetDto } from "@/models/exerciseSetDto";

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

    const weightInputRef = useRef(null);
    const [groups, setGroups] = useState<ExerciseGroup[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
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
            setGroups([]);
            setExercises([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        }
    };

    const loadGroups = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setGroups(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading groups:", error);
        }
    };

    const saveGroups = async (updatedGroups: ExerciseGroup[]) => {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedGroups)
            );
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
        try {
            const data = await getAllItems<Exercise[]>("/exercise");
            setExercises(data);
        } catch (error) {
            console.error("Error loading exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadWeightUnits = async () => {
        try {
            const data = await getAllItems<WeightUnit[]>("/weightunit");
            setWeightUnits(data);
        } catch (error) {
            console.error("Error loading weight units:", error);
        }
    };

    const handleAddGroupNoButton = async (exerciseId: number) => {
        const selectedExerciseData = exercises.find(
            (ex) => ex.exerciseid === exerciseId
        );
        if (!selectedExerciseData) return;
        if (
            groups.find(
                (group) => group.exerciseid === selectedExerciseData.exerciseid
            ) !== undefined
        ) {
            const existingGroup = groups.find(
                (group) => group.exerciseid === selectedExerciseData.exerciseid
            );
            if (existingGroup !== undefined) {
                setExpandedGroup(existingGroup.name);
            }

            return;
        }
        const updatedGroups = [
            ...groups,
            {
                exerciseid: selectedExerciseData.exerciseid,
                name: selectedExerciseData.exercisename,
                sets: [],
            },
        ];

        if (onGroupsChange) {
            onGroupsChange(updatedGroups);
        }
        setGroups(updatedGroups);
        await saveGroups(updatedGroups);
        setSelectedExercise(null);
    };

    const handleRemoveSet = async () => {};
    const handleAddSet = async (groupName: string) => {
        if (!weightInputRef || !reps || weightInputRef === null) return;
        const group = groups.find((g) => g.name === groupName);
        if (group === undefined) return;

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

        const updatedGroups = groups.map((group) =>
            group.name === groupName
                ? {
                      ...group,
                      sets: [...group.sets, newSet],
                  }
                : group
        );

        setGroups(updatedGroups);

        await saveGroups(updatedGroups);

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
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <View style={{ padding: 16 }}>
                <CustomDropdown
                    options={exercises}
                    onSelect={async (exercise) => {
                        await handleAddGroupNoButton(exercise.exerciseid);
                        setExpandedGroup(exercise.exercisename);
                    }}
                    selectedOption={selectedExercise}
                    placeholder='Select Exercise'
                />

                {groups.map((group) => (
                    <List.Accordion
                        key={group.name}
                        title={`${group.name} ${
                            group.weightUnit
                                ? `(${group.weightUnit.weightunitlabel})`
                                : ""
                        }`}
                        expanded={expandedGroup === group.name}
                        onPress={() =>
                            setExpandedGroup(
                                expandedGroup === group.name ? null : group.name
                            )
                        }
                    >
                        {/* Add Historical Performance Section */}
                        <List.Accordion
                            title='Previous Workout Data'
                            expanded={showHistory}
                            onPress={() => setShowHistory(!showHistory)}
                        >
                            {renderExerciseHistory(group.exerciseid)}
                        </List.Accordion>
                        <Menu
                            visible={weightUnitMenuVisible}
                            theme={theme}
                            onDismiss={() => {
                                setGroups(groups);
                                setWeightUnitMenuVisible(false);
                            }}
                            anchor={
                                <Button
                                    onPress={() => {
                                        setWeightUnitMenuVisible(true);
                                    }}
                                >
                                    {group.weightUnit?.weightunitname ||
                                        "Select Weight Unit"}
                                </Button>
                            }
                        >
                            {weightUnits.map((unit) => (
                                <Menu.Item
                                    key={unit.weightunitlookupid}
                                    onPress={() => {
                                        const updatedGroups = groups.map((g) =>
                                            g.name === group.name
                                                ? { ...g, weightUnit: unit }
                                                : g
                                        );
                                        setGroups(updatedGroups);
                                        setWeightUnitMenuVisible(false);
                                    }}
                                    title={unit.weightunitname}
                                />
                            ))}
                        </Menu>

                        {group.sets.map((set, index) => (
                            <List.Item
                                key={index}
                                title={`Set ${index + 1}`}
                                description={`Weight: ${set.weight}${
                                    group.weightUnit?.weightunitlabel || ""
                                }, Reps: ${set.repetitions}${
                                    set.estimatedrpe
                                        ? `, RPE: ${set.estimatedrpe}`
                                        : ""
                                }`}
                            />
                        ))}

                        <View style={{ padding: 8 }}>
                            <List.Accordion title='New Set...'>
                                <TextInput
                                    placeholder={
                                        "Weight (" +
                                        group.weightUnit?.weightunitlabel +
                                        ")"
                                    }
                                    value={weight}
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
                                onPress={() => handleAddSet(group.name)}
                            >
                                Add Set
                            </Button>
                        </View>
                    </List.Accordion>
                ))}
            </View>
        </ScrollView>
    );
};

export default ExerciseGroupList;
