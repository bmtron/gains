import { useAppTheme } from "@/app/_layout";
import { Button as RNPButton } from "react-native-paper";

type ThemedButtonProps = {
    onPress: () => Promise<void>;
    text: string;
};

const Button = (props: ThemedButtonProps) => {
    const theme = useAppTheme();
    return (
        <RNPButton
            style={{
                backgroundColor: theme.colors.buttonStandard,

                width: "50%",
            }}
            textColor={theme.colors.paperWhite}
            onPress={async () => await props.onPress()}
        >
            {props.text}
        </RNPButton>
    );
};

export { Button, ThemedButtonProps };
