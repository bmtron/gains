import { PropsWithChildren } from "react";
import { View } from "react-native";

const PaddedView = (props: PropsWithChildren) => {
    return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            {props.children}
        </View>
    );
};

export default PaddedView;
