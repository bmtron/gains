import { WorkoutDto } from "@/models/workoutDto";
import { postWorkout } from "./postWorkout";
import { databaseOperations } from "../localstorage/databaseOperations";

export const postWorkoutWithTimeout = async (
    workoutDto: WorkoutDto,
    isRetry: boolean = false
): Promise<boolean> => {
    const TIMEOUT_MS = 10000; // 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Request timed out"));
        }, TIMEOUT_MS);
    });
    try {
        const result = await Promise.race([
            postWorkout(workoutDto),
            timeoutPromise,
        ]);
        return true;
    } catch (error) {
        console.error(error);
        console.log("here?");
        if (!isRetry) {
            await databaseOperations.addWorkout(workoutDto);
        }
        return false;
    }
};
