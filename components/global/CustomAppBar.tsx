import * as React from "react";
import { Appbar } from "react-native-paper";

type CustomAppBarProps = {
    title: string;
};

const CustomAppBar = (props: CustomAppBarProps) => {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => {}} />
            <Appbar.Content title={props.title} />
        </Appbar.Header>
    );
};

export default CustomAppBar;
