import React from "react";
import { Text } from "react-native-paper";

interface WorkoutTimerProps {
    elapsedTime: number;
}

const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const WorkoutTimer = React.memo(({ elapsedTime }: WorkoutTimerProps) => {
    return (
        <Text style={{ fontSize: 32, textAlign: "center" }}>
            {formatTime(elapsedTime)}
        </Text>
    );
});
