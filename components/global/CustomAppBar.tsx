import * as React from "react";
import { Appbar, MD3Theme } from "react-native-paper";
import { router } from "expo-router";
import { useAppTheme } from "@/app/_layout";

type CustomAppBarProps = {
    title: string;
};

const CustomAppBar = (props: CustomAppBarProps) => {
    const theme = useAppTheme();
    return (
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
            <Appbar.BackAction
                onPress={() => {
                    router.back();
                }}
                style={{}}
                color={theme.colors.laserBlue}
            />
            <Appbar.Content title={props.title} />
        </Appbar.Header>
    );
};

export default CustomAppBar;
