import { useAppTheme } from "@/app/_layout";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";

interface FailureBannerProps {
    alertText: string;
    buttonText: string;
    buttonCallback: () => void;
}
const theme = useAppTheme();
const FailureBanner = ({
    alertText,
    buttonCallback,
    buttonText,
}: FailureBannerProps) => {
    return (
        <View style={styles.alertBanner}>
            <Text style={styles.alertText}>{alertText}</Text>
            <Button
                mode='contained'
                onPress={buttonCallback}
                style={styles.retryButton}
                textColor={theme.colors.paperWhite}
            >
                {buttonText}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    alertBanner: {
        backgroundColor: theme.colors.error,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    alertText: {
        color: theme.colors.surface,
        flex: 1,
        marginRight: 8,
    },
    retryButton: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.paperWhite,
    },
});

export default FailureBanner;
