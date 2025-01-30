import { WorkoutDto } from "@/models/workoutDto";
import { postWorkout } from "./postWorkout";
import { workoutOperations } from "../localstorage/localWorkouts";

export const postWorkoutWithTimeout = async (
    workoutDto: WorkoutDto,
    isRetry: boolean = false
): Promise<boolean> => {
    const x = 1;
    const y = 6;
    if (x === 1) {
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
            console.log(result);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    } else {
        if (!isRetry) {
            await workoutOperations.addWorkout(workoutDto);
        }
        return false;
    }
};
