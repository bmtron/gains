import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import { Button, List, Menu } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import { ExerciseLocal } from "@/models/exerciseModels";
import CustomDropdown from "../global/CustomDropdown";
import { WeightUnit } from "@/models/weightUnit";
import { ExerciseGroup } from "@/models/exerciseGroup";
import NotificationModal from "../common/NotificationModal";
import HistoricalExerciseSet from "@/models/historicalExerciseSet";
import ExerciseHistory from "./ExerciseHistory";
import { useFocusEffect } from "expo-router";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { AddSetCard } from "./AddSetCard";
import { ActiveSetDisplayCard } from "./ActiveSetDisplayCard";
import {
    AddExerciseGroupProps,
    handleAddExerciseGroup,
    handleRemoveExercise,
    handleRemoveExerciseSet,
    loadExercises,
    loadHistoricalWorkouts,
    loadWeightUnitsFromLocal,
    RemoveExerciseProps,
} from "./ExerciseHelpers";

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

    const [groupsLoaded, setGroupsLoaded] = useState(false);
    const [weightUnitsLoaded, setWeightUnitsLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("NO_MESSAGE_SET_");

    useFocusEffect(
        useCallback(() => {
            const loadInitialData = async () => {
                try {
                    await loadExercises(setExercises);
                } catch (error) {
                    console.error("Error loading exercises:", error);
                }
            };
            loadInitialData();
        }, [])
    );

    // Third useEffect - Load weight units after groups
    useEffect(() => {
        const loadWeightData = async () => {
            try {
                await loadWeightUnitsFromLocal(setWeightUnits);
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
                await loadHistoricalWorkouts(weightUnits, setHistoricalSets);
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
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
                            const addExerciseGroupProps: AddExerciseGroupProps =
                                {
                                    exerciseLocalId: exercise.exerciseLocalId,
                                    exercises: exercises,
                                    exerciseGroups: exerciseGroups,
                                    setExpandedGroup: setExpandedGroup,
                                    weightUnits: weightUnits,
                                    onGroupsChange: onGroupsChange,
                                    setExerciseGroups: setExerciseGroups,
                                    setSelectedExercise: setSelectedExercise,
                                };
                            await handleAddExerciseGroup(addExerciseGroupProps);
                            setExpandedGroup(exercise.exercisename);
                        }}
                        selectedOption={selectedExercise}
                        placeholder='Select Exercise'
                    />

                    {exerciseGroups.map((exercise, index) => (
                        <Swipeable
                            key={index}
                            renderRightActions={() =>
                                expandedGroup !== exercise.name && (
                                    <TouchableOpacity
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "red",
                                            width: 75,
                                        }}
                                        onPress={(e) => {
                                            console.log("onPress");
                                            e.stopPropagation();
                                            const removeExerciseProps: RemoveExerciseProps =
                                                {
                                                    group: exercise,
                                                    exerciseGroups:
                                                        exerciseGroups,
                                                    setExerciseGroups:
                                                        setExerciseGroups,
                                                    onGroupsChange:
                                                        onGroupsChange,
                                                };
                                            handleRemoveExercise(
                                                removeExerciseProps
                                            );
                                        }}
                                    >
                                        <List.Icon icon='delete' />
                                    </TouchableOpacity>
                                )
                            }
                        >
                            <List.Accordion
                                key={index}
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
                                            {exercise.weightUnit
                                                ?.weightunitname ||
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
                                                                  weightUnit:
                                                                      unit,
                                                              }
                                                            : g
                                                    );
                                                setExerciseGroups(
                                                    updatedGroups
                                                );
                                                setWeightUnitMenuVisible(false);
                                            }}
                                            title={unit.weightunitname}
                                        />
                                    ))}
                                </Menu>

                                {exercise.sets.map((set, index) => (
                                    <ActiveSetDisplayCard
                                        exerciseGroup={exercise}
                                        set={set}
                                        index={index}
                                        removeSetHandler={
                                            handleRemoveExerciseSet
                                        }
                                    />
                                ))}
                                <AddSetCard
                                    exercise={exercise}
                                    weight={weight}
                                    setWeight={setWeight}
                                    reps={reps}
                                    setReps={setReps}
                                    rpe={rpe}
                                    setRpe={setRpe}
                                    exerciseGroups={exerciseGroups}
                                    setExerciseGroups={setExerciseGroups}
                                    modalVisibilityHandler={setModalVisible}
                                    modalMessageHandler={setModalMessage}
                                    onGroupsChange={onGroupsChange}
                                />
                            </List.Accordion>
                        </Swipeable>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ExerciseGroupList;
