import React, { useState } from "react";
import { WorkoutDto } from "@/models/workoutDto";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Exercise, ExerciseDto } from "@/models/exerciseModels";
import { Surface, Text, List } from "react-native-paper";
import { ScrollView } from "react-native";
import { useAppTheme } from "@/app/_layout";

interface WorkoutItemProps {
    workout: WorkoutDto;
    exerciseList: Exercise[];
}
const WorkoutItem = ({ workout, exerciseList }: WorkoutItemProps) => {
    const theme = useAppTheme();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };
    const workoutExercises = exerciseList.reduce((acc, set) => {
        const item = workout.ExerciseSets.find(
            (e) => e.exerciseid === set.exerciseid
        );

        if (item !== undefined) {
            acc.push(set);
        }
        return acc;
    }, [] as Exercise[]);
    return (
        <List.Accordion title={formatDate(workout.DateStarted)} theme={theme}>
            {workoutExercises.map((exercise, index) => (
                <List.Item
                    key={index}
                    theme={theme}
                    title={exercise?.exercisename}
                    description={() => (
                        <Surface
                            theme={theme}
                            style={{ margin: 10, padding: 10 }}
                        >
                            <ScrollView>
                                {workout.ExerciseSets.filter(
                                    (set) =>
                                        set.exerciseid === exercise?.exerciseid
                                ).map((set, setIndex) => (
                                    <Text
                                        key={setIndex}
                                        theme={theme}
                                        style={{
                                            color: theme.colors.paperWhite,
                                            padding: 5,
                                        }}
                                    >
                                        Set {setIndex + 1}: {set.weight}lbs ×{" "}
                                        {set.repetitions} reps
                                        {set.estimatedrpe &&
                                            ` @ RPE ${set.estimatedrpe}`}
                                    </Text>
                                ))}
                            </ScrollView>
                        </Surface>
                    )}
                />
            ))}
        </List.Accordion>
    );
};

interface workoutHistoryProps {
    workouts: WorkoutDto[];
    exerciseList: Exercise[];
}
const WorkoutHistory = ({ workouts, exerciseList }: workoutHistoryProps) => {
    const theme = useAppTheme();
    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: theme.colors.background,
            }}
        >
            <ScrollView>
                <List.Section theme={theme}>
                    {workouts.map((workout, index) => (
                        <WorkoutItem
                            key={index}
                            workout={workout}
                            exerciseList={exerciseList}
                        />
                    ))}
                </List.Section>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    workoutContainer: {
        backgroundColor: "#fff",
        marginVertical: 4,
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    workoutHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
    },
    expandIcon: {
        fontSize: 12,
    },
    exerciseList: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    exerciseItem: {
        marginTop: 12,
    },
    exerciseName: {
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 4,
    },
    setList: {
        marginLeft: 8,
    },
    setItem: {
        marginVertical: 2,
    },
    setText: {
        fontSize: 14,
        color: "#666",
    },
});

export default WorkoutHistory;
