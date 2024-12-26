import { Dialog, Text, Button } from "react-native-paper";

type CustomDialogProps = {
    visible: boolean;
    hideDialog: () => void;
    dialogText: string;
    title: string;
};
const CustomDialog = (dialogProps: CustomDialogProps) => {
    return (
        <Dialog
            visible={dialogProps.visible}
            onDismiss={dialogProps.hideDialog}
        >
            <Dialog.Title>{dialogProps.title}</Dialog.Title>
            <Dialog.Content>
                <Text>{dialogProps.dialogText}</Text>
                <Dialog.Actions>
                    <Button onPress={dialogProps.hideDialog}>Ok</Button>
                </Dialog.Actions>
            </Dialog.Content>
        </Dialog>
    );
};

export { CustomDialogProps, CustomDialog };
