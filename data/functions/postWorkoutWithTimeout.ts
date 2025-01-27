import { WorkoutDto } from "@/models/workoutDto";
import { postWorkout } from "./postWorkout";
import { FAILED_POST_STORAGE_KEY } from "@/constants/storagekeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const postWorkoutWithTimeout = async (
    workoutDto: WorkoutDto
): Promise<boolean> => {
    const TIMEOUT_MS = 10000; // 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Request timed out"));
        }, TIMEOUT_MS);
    });
    try {
        await Promise.race([postWorkout(workoutDto), timeoutPromise]);
        return true;
    } catch (error) {
        await AsyncStorage.setItem(
            FAILED_POST_STORAGE_KEY,
            JSON.stringify(workoutDto)
        );
        return false;
    }
};
