import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { TextInput, Button, Text, List, Menu, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/app/_layout";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise } from "@/models/exerciseModels";
import WeightUnitLookup from "@/models/weightunitlookup";
import CustomDropdown from "../global/CustomDropdown";
import { WeightUnit } from "@/models/weightUnit";
import { ExerciseGroup } from "@/models/exerciseGroup";
import ExerciseSet from "@/models/exercisesetModels";
import { ExerciseSetDto } from "@/models/exerciseSetDto";

const STORAGE_KEY = "@exercise_groups";
const HISTORY_STORAGE_KEY = "@exercise_history";

interface HistoricalSet extends ExerciseSetDto {
    date: string;
}
interface HistoricalWorkout {
    date: string;
    sets: HistoricalSet[];
    weightUnit: WeightUnit;
}

interface ExerciseHistory {
    [exerciseId: number]: HistoricalWorkout[];
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
    const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory>({});
    const [showHistory, setShowHistory] = useState<boolean>(false);

    useEffect(() => {
        loadExercises();
        loadGroups();
        loadWeightUnits();
        loadExerciseHistory();
        clearOldDataTask();
    }, []);
    const clearOldDataTask = async () => {
        if (clearOldData) {
            setGroups([]);
            setExercises([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        }
    };
    const loadExerciseHistory = async () => {
        try {
            const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
            if (stored) {
                setExerciseHistory(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading exercise history:", error);
        }
    };
    const saveExerciseHistory = async (updatedHistory: ExerciseHistory) => {
        try {
            await AsyncStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(updatedHistory)
            );
            setExerciseHistory(updatedHistory);
        } catch (error) {
            console.error("Error saving exercise history:", error);
        }
    };
    const saveToHistory = async (groupName: string, sets: ExerciseSetDto[]) => {
        const group = groups.find((g) => g.name === groupName);
        if (!group || sets.length === 0) return;

        const workout: HistoricalWorkout = {
            date: new Date().toISOString(),
            sets: sets.map((set) => ({
                ...set,
                date: new Date().toISOString(),
            })),
            weightUnit: group.weightUnit || weightUnits[0],
        };

        const updatedHistory = {
            ...exerciseHistory,
            [group.exerciseid]: [
                ...(exerciseHistory[group.exerciseid] || []),
                workout,
            ],
        };

        await saveExerciseHistory(updatedHistory);
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
            const data = await getAllItems<ExerciseSet[]>("/exerciseset");
        } catch (error) {
            console.error("Error loading exercise sets:", error);
        } finally {
            setLoading(false);
        }
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

    const handleAddGroup = async () => {
        if (!selectedExercise) return;
        if (
            groups.find(
                (group) => group.exerciseid === selectedExercise.exerciseid
            ) !== undefined
        ) {
            const existingGroup = groups.find(
                (group) => group.exerciseid === selectedExercise.exerciseid
            );
            if (existingGroup !== undefined) {
                setExpandedGroup(existingGroup.name);
            }

            return;
        }
        const updatedGroups = [
            ...groups,
            {
                exerciseid: selectedExercise.exerciseid,
                name: selectedExercise.exercisename,
                sets: [],
            },
        ];

        setGroups(updatedGroups);
        await saveGroups(updatedGroups);
        setSelectedExercise(null);
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

    const handleAddSet = async (groupName: string) => {
        if (!weight || !reps) return;
        const group = groups.find((g) => g.name === groupName);
        if (group === undefined) return;

        const newSet: ExerciseSetDto = {
            Exerciseid: group?.exerciseid,
            Weight: parseFloat(weight),
            Repetitions: parseInt(reps),
            Estimatedrpe: rpe ? parseFloat(rpe) : 0,
            Weightunitlookupid:
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
        console.log(updatedGroups);
        await saveGroups(updatedGroups);

        if (group) {
            await saveToHistory(groupName, [newSet]);
        }
        if (onGroupsChange) {
            onGroupsChange(updatedGroups);
        }
        setWeight("");
        setReps("");
        setRpe("");
    };
    const renderExerciseHistory = (exerciseId: number) => {
        const history = exerciseHistory[exerciseId] || [];
        if (history.length === 0) {
            return (
                <Card style={{ margin: 8, padding: 8 }}>
                    <Text>No previous workout data available.</Text>
                </Card>
            );
        }

        return (
            <View style={{ margin: 8 }}>
                {history
                    .slice(-3)
                    .reverse()
                    .map((workout, idx) => (
                        <Card key={idx} style={{ marginBottom: 8, padding: 8 }}>
                            <Text style={{ fontWeight: "bold" }}>
                                {new Date(workout.date).toLocaleDateString()}
                            </Text>
                            {workout.sets.map((set, setIdx) => (
                                <Text key={setIdx}>
                                    Set {setIdx + 1}: {set.Weight}
                                    {workout.weightUnit.weightunitlabel} x{" "}
                                    {set.Repetitions} reps
                                    {set.Estimatedrpe
                                        ? ` @ RPE ${set.Estimatedrpe}`
                                        : ""}
                                </Text>
                            ))}
                        </Card>
                    ))}
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
                                        console.log(groups);
                                        const updatedGroups = groups.map((g) =>
                                            g.name === group.name
                                                ? { ...g, weightUnit: unit }
                                                : g
                                        );
                                        console.log(updatedGroups);
                                        console.log(unit);
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
                                description={`Weight: ${set.Weight}${
                                    group.weightUnit?.weightunitlabel || ""
                                }, Reps: ${set.Repetitions}${
                                    set.Estimatedrpe
                                        ? `, RPE: ${set.Estimatedrpe}`
                                        : ""
                                }`}
                            />
                        ))}

                        <View style={{ padding: 8 }}>
                            <List.Accordion title='New Set...'>
                                <TextInput
                                    label={
                                        "Weight (" +
                                        group.weightUnit?.weightunitlabel +
                                        ")"
                                    }
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType='numeric'
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
