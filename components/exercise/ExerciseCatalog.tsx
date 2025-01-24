import { useAppTheme } from "@/app/_layout";
import { ScrollView, View } from "react-native";
import { List, Text } from "react-native-paper";
import CustomAppBar from "../global/CustomAppBar";
import { useEffect, useState } from "react";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise } from "@/models/exerciseModels";
import PaddedView from "../global/PaddedView";

const ExerciseCatalog = () => {
    const theme = useAppTheme();
    const [exerciseList, setExerciseList] = useState<Exercise[]>();
    useEffect(() => {
        const getAllExercises = async () => {
            const exercises = await getAllItems<Exercise[]>("/exercise");
            setExerciseList(exercises);
        };
        getAllExercises();
    }, []);
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title={"Exercise Catalog"} />
            <PaddedView>
                <Text>Exercise catalog goes here</Text>
                <ScrollView>
                    {exerciseList === undefined ? (
                        <></>
                    ) : (
                        exerciseList.map((ex, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    titleStyle={{
                                        color: theme.colors.paperWhite,
                                    }}
                                    title={ex.exercisename}
                                    description={ex.notes}
                                    descriptionStyle={{}}
                                ></List.Item>
                            );
                        })
                    )}
                </ScrollView>
            </PaddedView>
        </View>
    );
};

export default ExerciseCatalog;
