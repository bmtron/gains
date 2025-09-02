import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { Text, Card, Button, IconButton } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { useAppTheme } from "@/app/_layout";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { WorkoutDto } from "@/models/workoutDto";
import NotificationModal from "@/components/common/NotificationModal";
import { postWorkoutWithTimeout } from "@/data/functions/postWorkoutWithTimeout";
import { SafeAreaView } from "react-native-safe-area-context";
import { initDatabase } from "@/data/localstorage/database";
import { databaseOperations } from "@/data/localstorage/databaseOperations";
import { DB_NAME } from "@/constants/databaseconstants";
import FailureBanner from "@/components/common/FailureBanner";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { setExerciseDataServerId } from "@/data/functions/setExerciseDataServerId";
import getAllItems from "@/data/functions/getAllItems";
import MuscleGroup from "@/models/muscleGroupModels";
import { useAppDispatch } from "@/state/hooks";
import { loadMuscleGroups } from "@/state/muscleGroupReducer";

export default function Index() {
    const theme = useAppTheme();
    const [failedData, setFailedData] = useState<WorkoutDto>();
    const [modalMessage, setModalMessage] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const muscleGroups = await getAllItems<MuscleGroup[]>(
                    "/musclegroup"
                );
                dispatch(loadMuscleGroups(muscleGroups));
            })();
            const checkForFailedData = async () => {
                const failed = await databaseOperations.getUnsyncedWorkouts();
                if (failed !== null && failed.length > 0) {
                    setFailedData(failed[0]);
                }
            };
            if (Platform.OS !== "web") {
                checkForFailedData();
            }
        }, [])
    );
    useEffect(() => {
        // we can do this here, for now
        // perhaps need to move this to its own file/section,
        // and possibly manual triggers for this as well

        const syncInExercises = async () => {
            await databaseOperations.syncInExercises();
        };
        const syncInWeightUnits = async () => {
            await databaseOperations.syncInWeightUnits();
        };
        const initDb = async () => {
            await initDatabase();
        };
        const deleteDb = async () => {
            const SQLite = await import("expo-sqlite");
            await SQLite.deleteDatabaseAsync(DB_NAME);
            console.log("DELETED_DB");
        };
        if (Platform.OS !== "web") {
            initDb();
            //deleteDb();
            syncInExercises();
            syncInWeightUnits();
        }
    }, []);

    const handleRetrySync = async () => {
        if (failedData !== undefined) {
            console.log(failedData.ExerciseSets);
            failedData.ExerciseSets = await setExerciseDataServerId(
                failedData.ExerciseSets
            );
            console.log(failedData.ExerciseSets);
            const result = await postWorkoutWithTimeout(failedData, true);
            if (result) {
                setIsModalVisible(true);
                if (failedData.WorkoutLocalId !== undefined) {
                    await databaseOperations.markWorkoutDataSynced(
                        failedData.WorkoutLocalId
                    );
                } else {
                    setModalMessage(
                        "Error marking synced. Undefined workoutlocalid on object."
                    );
                    return;
                }

                setModalMessage(
                    "Previously failed workout data has been successfully uploaded."
                );
                setFailedData(undefined);

                return;
            }
            setIsModalVisible(true);
            setModalMessage(
                "Error saving workout data. Ensure the internet is connected and the VPN is stable, and try again."
            );
        }
    };
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <ScrollView style={styles.container}>
                <NotificationModal
                    isVisible={isModalVisible}
                    setModalVisibile={setIsModalVisible}
                    message={modalMessage}
                />
                {failedData && (
                    <FailureBanner
                        alertText='A workout(s) failed to sync with server'
                        buttonText='Retry Sync'
                        buttonCallback={handleRetrySync}
                    />
                )}
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Ready to Train?</Text>
                    <IconButton
                        icon='cog'
                        size={24}
                        onPress={() => {}}
                        mode='contained'
                        containerColor={theme.colors.primaryContainer}
                    />
                </View>

                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>PRs This Week</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>Completion</Text>
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    <Card style={styles.card} mode='elevated'>
                        <Card.Content style={styles.cardContent}>
                            <MaterialCommunityIcons
                                name='dumbbell'
                                size={32}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.cardTitle}>Start Workout</Text>
                            <Text style={styles.cardDescription}>
                                Begin today's training session or create a new
                                workout
                            </Text>
                            <Button
                                mode='contained'
                                style={styles.linkButton}
                                onPress={() =>
                                    router.navigate("/(tabs)/(workout)")
                                }
                            >
                                Start Training
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card} mode='elevated'>
                        <Card.Content style={styles.cardContent}>
                            <MaterialCommunityIcons
                                name='chart-line'
                                size={32}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.cardTitle}>
                                Progress Tracking
                            </Text>
                            <Text style={styles.cardDescription}>
                                View your strength gains and personal records
                            </Text>
                            <Button
                                mode='contained-tonal'
                                style={styles.linkButton}
                                onPress={() => {}}
                            >
                                View Progress
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card} mode='elevated'>
                        <Card.Content style={styles.cardContent}>
                            <MaterialCommunityIcons
                                name='calendar-clock'
                                size={32}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.cardTitle}>
                                Workout History
                            </Text>
                            <Text style={styles.cardDescription}>
                                Review past workouts and exercise logs
                            </Text>
                            <Button
                                mode='contained-tonal'
                                style={styles.linkButton}
                                onPress={() =>
                                    router.navigate("/(tabs)/(workouthistory)")
                                }
                            >
                                View History
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card} mode='elevated'>
                        <Card.Content style={styles.cardContent}>
                            <MaterialCommunityIcons
                                name='playlist-edit'
                                size={32}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.cardTitle}>
                                Gains Configuration
                            </Text>
                            <Text style={styles.cardDescription}>
                                Manage your workout programs and routines, and
                                configure additional aspects of the application.
                            </Text>
                            <Button
                                mode='contained-tonal'
                                style={styles.linkButton}
                                onPress={() =>
                                    router.navigate("/(tabs)/(configuration)")
                                }
                            >
                                Configure
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const theme = useAppTheme();
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
    },
    header: {
        marginVertical: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.secondary,
        marginBottom: 24,
    },
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: theme.colors.secondary,
        marginBottom: 16,
    },
    linkButton: {
        borderRadius: 8,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
        padding: 16,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 12,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.secondary,
    },
    alertBanner: {
        backgroundColor: theme.colors.error,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    alertText: {
        color: theme.colors.surface,
        flex: 1,
        marginRight: 8,
    },
    retryButton: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.paperWhite,
    },
});
