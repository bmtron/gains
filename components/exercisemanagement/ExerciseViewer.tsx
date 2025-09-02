import { useState, useCallback, useEffect } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Text, Searchbar, TouchableRipple, List } from "react-native-paper";
import getAllExercises from "@/data/functions/getAllExercises";
import { Exercise } from "@/models/exerciseModels";
import { useAppTheme } from "@/app/_layout";
import CustomAppBar from "../global/CustomAppBar";
import { useFocusEffect } from "@react-navigation/native";

import {
    addExercise,
    updateExercise,
    overwriteExercises,
    removeExercise,
} from "../../state/exerciseReducer";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { ExerciseDetailsModal } from "./ExerciseDetailsModal";
import { deleteExercise } from "@/data/functions/removeExercise";

export const ExerciseViewerView = () => {
    const theme = useAppTheme();
    const [localExercises, setLocalExercises] = useState<Exercise[]>([]);
    //const [reducedExercises, setReducedExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedModalExercise, setSelectedModalExercise] =
        useState<Exercise>();
    const exercises = useAppSelector((state) => state.exercise);
    const muscleGroups = useAppSelector((state) => state.musclegroup);
    const dispatch = useAppDispatch();

    // useFocusEffect(
    //     useCallback(() => {
    //         (async () => {
    //             const exerciseList = await getAllExercises();
    //             const sorted = exerciseList.sort(
    //                 (a, b) => a.musclegroupid - b.musclegroupid
    //             );
    //             dispatch(overwriteExercises(sorted));

    //             setLocalExercises(sorted);
    //         })();
    //         console.log("working?");
    //     }, [dispatch])
    // );

    useEffect(() => {
        console.log("exercises updated:", exercises);
        (async () => {
            const exerciseList = await getAllExercises();
            const sorted = exerciseList.sort(
                (a, b) => a.musclegroupid - b.musclegroupid
            );
            dispatch(overwriteExercises(sorted));

            setLocalExercises(sorted);
        })();
    }, [exercises, dispatch]);

    const filtered = localExercises.filter((ex) => {
        if (searchQuery === "") {
            return ex;
        }

        return ex.exercisename
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    });

    const handleRemoveExercise = async (exercise: Exercise) => {
        // let result = await
        console.log("hello?");
        let result = await deleteExercise(exercise);
        console.log("hello");
        if (result) {
            dispatch(removeExercise(exercise.exerciseid));
        }
    };
    const exercisesView = (
        <ScrollView style={{ padding: 16 }}>
            {filtered.map((exercise, index) => (
                <TouchableRipple
                    onPress={() => {
                        setSelectedModalExercise(exercise);
                        setShowDetailsModal(true);
                    }}
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
                </TouchableRipple>
                // <Swipeable
                //     key={index}
                //     renderRightActions={() => (
                //         <TouchableOpacity
                //             style={{
                //                 display: "flex",
                //                 justifyContent: "center",
                //                 alignItems: "center",
                //                 backgroundColor: "red",
                //                 width: 75,
                //             }}
                //             onPress={(e) => {
                //                 console.log("onPress");
                //                 e.stopPropagation();
                //                 handleRemoveExercise(exercise);
                //             }}
                //         >
                //             <List.Icon icon='delete' />
                //         </TouchableOpacity>
                //     )}
                // >

                // </Swipeable>
            ))}
        </ScrollView>
    );

    const detailsModal = () => {
        if (selectedModalExercise === undefined) {
            return null; // handle the error better TODO
        }

        let muscleGroupIndex = muscleGroups.findIndex(
            (m) => m.musclegroupid === selectedModalExercise.musclegroupid
        );

        return (
            <ExerciseDetailsModal
                exercise={selectedModalExercise}
                hideDetailsModal={setShowDetailsModal}
                musclegroup={muscleGroups[muscleGroupIndex]}
                visible={showDetailsModal}
                removeExercise={handleRemoveExercise}
            />
        );
    };

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
                    console.log(exercises);
                }}
                value={searchQuery}
            />
            {exercisesView}
            {showDetailsModal && detailsModal()}
        </View>
    );
};
