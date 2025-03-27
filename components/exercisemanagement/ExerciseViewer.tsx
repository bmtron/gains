import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Searchbar } from "react-native-paper";
import getAllExercises from "@/data/functions/getAllExercises";
import { Exercise } from "@/models/exerciseModels";
import { useAppTheme } from "@/app/_layout";
import CustomAppBar from "../global/CustomAppBar";

export const ExerciseViewerView = () => {
    const theme = useAppTheme();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [reducedExercises, setReducedExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const fetchExercises = async () => {
            const exerciseList = await getAllExercises();
            setExercises(exerciseList);
            setReducedExercises(exerciseList);
        };
        fetchExercises();
    }, []);
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title={"Exercise Search"} />

            <Searchbar
                placeholder='Search for an exercise'
                onChangeText={(text) => {
                    setSearchQuery(text);
                    setReducedExercises(
                        exercises.filter((exercise) =>
                            exercise.exercisename
                                .toLowerCase()
                                .includes(text.toLowerCase())
                        )
                    );
                }}
                value={searchQuery}
            />
            <ScrollView style={{ padding: 16 }}>
                {reducedExercises.map((exercise) => (
                    <View
                        key={exercise.exerciseid}
                        style={{
                            backgroundColor: theme.colors.surface,
                            padding: 16,
                            marginBottom: 12,
                            borderRadius: 8,
                            elevation: 2,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: theme.colors.onSurface,
                            }}
                        >
                            {exercise.exercisename}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
