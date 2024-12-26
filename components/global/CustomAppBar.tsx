import * as React from "react";
import { Appbar } from "react-native-paper";
import { router } from "expo-router";

type CustomAppBarProps = {
    title: string;
};

const CustomAppBar = (props: CustomAppBarProps) => {
    return (
        <Appbar.Header>
            <Appbar.BackAction
                onPress={() => {
                    router.back();
                }}
            />
            <Appbar.Content title={props.title} />
        </Appbar.Header>
    );
};

export default CustomAppBar;
