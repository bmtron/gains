import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
    TextInput,
    Button,
    Text,
    List,
    Menu,
    Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/app/_layout";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise } from "@/models/exerciseModels";
import WeightUnitLookup from "@/models/weightunitlookup";
import CustomDropdown from "../global/CustomDropdown";

const STORAGE_KEY = "@exercise_groups";

interface WeightUnit extends WeightUnitLookup {}

interface ExerciseSet {
    id: string;
    weight: number;
    reps: number;
    rpe?: number; // Optional RPE field
}

interface ExerciseGroup {
    exerciseid: number;
    name: string;
    sets: ExerciseSet[];
    weightUnit?: WeightUnit; // Make weightUnit optional
}

interface ExerciseGroupListProps {
    onGroupsChange?: (groups: ExerciseGroup[]) => void;
}
const ExerciseGroupList = ({ onGroupsChange }: ExerciseGroupListProps) => {
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

    useEffect(() => {
        loadExercises();
        loadGroups();
        loadWeightUnits();
    }, []);

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

        const updatedGroups = groups.map((group) =>
            group.name === groupName
                ? {
                      ...group,
                      sets: [
                          ...group.sets,
                          {
                              id: Date.now().toString(),
                              weight: parseFloat(weight),
                              reps: parseInt(reps),
                              rpe: rpe ? parseFloat(rpe) : undefined,
                          },
                      ],
                  }
                : group
        );

        setGroups(updatedGroups);
        await saveGroups(updatedGroups);
        setWeight("");
        setReps("");
        setRpe("");
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
                {/* <Menu
                    visible={menuVisible}
                    theme={theme}
                    onDismiss={() => setMenuVisible(false)}
                    anchorPosition='bottom'
                    contentStyle={{
                        backgroundColor: theme.colors.buttonStandard,
                    }}
                    style={{
                        position: "absolute",
                        left: 0,
                    }}
                    anchor={
                        <Button
                            onPress={() => setMenuVisible(true)}
                            textColor={theme.colors.laserBlue}
                            style={{
                                backgroundColor: theme.colors.buttonStandard,
                            }}
                        >
                            {selectedExercise?.exercisename ||
                                "Select Exercise"}
                        </Button>
                    }
                >
                    {exercises.map((exercise) => (
                        <Menu.Item
                            key={exercise.exerciseid}
                            onPress={() => {
                                handleAddGroupNoButton(exercise);
                                setExpandedGroup(exercise.exercisename);
                                setMenuVisible(false);
                            }}
                            title={exercise.exercisename}
                            style={{
                                backgroundColor: theme.colors.buttonStandard,
                            }}
                        />
                    ))}
                </Menu> */}

                {
                    // <Button
                    //     mode='contained'
                    //     onPress={handleAddGroup}
                    //     style={{
                    //         marginBottom: 16,
                    //         backgroundColor: theme.colors.buttonStandard,
                    //     }}
                    //     disabled={!selectedExercise}
                    //     textColor={theme.colors.paperWhite}
                    // >
                    //     Add Exercise
                    // </Button>
                }

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
                                        // const updatedGroups = groups.map((g) =>
                                        //     g.name === group.name
                                        //         ? {
                                        //               ...g,
                                        //               weightUnitMenuVisible:
                                        //                   true,
                                        //           }
                                        //         : g
                                        // );
                                        // setGroups(updatedGroups);
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
                                        console.log("wtf");
                                        setGroups(updatedGroups);
                                        setWeightUnitMenuVisible(false);
                                    }}
                                    title={unit.weightunitname}
                                />
                            ))}
                        </Menu>

                        {group.sets.map((set, index) => (
                            <List.Item
                                key={set.id}
                                title={`Set ${index + 1}`}
                                description={`Weight: ${set.weight}${
                                    group.weightUnit?.weightunitlabel || ""
                                }, Reps: ${set.reps}${
                                    set.rpe ? `, RPE: ${set.rpe}` : ""
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
