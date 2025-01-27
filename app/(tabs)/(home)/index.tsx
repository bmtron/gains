import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button, IconButton } from "react-native-paper";
import { Link } from "expo-router";
import { useAppTheme } from "@/app/_layout";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function Index() {
    const theme = useAppTheme();
    const navigation = useNavigation();
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
    });

    return (
        <ScrollView style={styles.container}>
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
                            onPress={() => router.navigate("/(tabs)/(workout)")}
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
                        <Text style={styles.cardTitle}>Progress Tracking</Text>
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
                        <Text style={styles.cardTitle}>Workout History</Text>
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
    );
}
