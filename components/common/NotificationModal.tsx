import { useAppTheme } from "@/app/_layout";
import { set } from "lodash";
import { View, StyleSheet } from "react-native";
import { Text, Button, Portal, Modal } from "react-native-paper";

interface NotifcationModalProps {
    message: string;
    isVisible: boolean;
    setModalVisibile: (isVisible: boolean) => void;
}
const NotificationModal = ({
    message,
    isVisible,
    setModalVisibile,
}: NotifcationModalProps) => {
    const theme = useAppTheme();
    return (
        <Portal>
            <Modal
                visible={isVisible}
                onDismiss={() => setModalVisibile(false)}
                contentContainerStyle={{
                    backgroundColor: theme.colors.background,
                    padding: 20,
                    margin: 20,
                    borderRadius: 8,
                }}
            >
                <Text style={{ marginBottom: 16 }}>{message}</Text>
                <Button
                    mode='contained'
                    onPress={() => setModalVisibile(false)}
                >
                    OK
                </Button>
            </Modal>
        </Portal>
    );
};

export default NotificationModal;
