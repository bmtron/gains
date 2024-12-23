import React from "react";
import { PropsWithChildren } from "react";
import { MD2Theme, Text } from "react-native-paper";

// this whole file is unnecessary, as the <Text /> component from react-native-paper already has
// theming built in
interface ThemedTextProps {
    theme: MD2Theme;
}
export default function ThemedText(props: PropsWithChildren<ThemedTextProps>) {
    return (
        <Text style={{ color: props.theme.colors.text }}>{props.children}</Text>
    );
}
