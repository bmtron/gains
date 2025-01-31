import { useAppTheme } from "@/app/_layout";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    LayoutAnimation,
    StyleSheet,
    Platform,
} from "react-native";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { ScrollView as RNScrollView } from "react-native";

interface CustomDropdownProps {
    options: Array<{ exerciseLocalId: number; exercisename: string }>;
    onSelect: (option: {
        exerciseLocalId: number;
        exercisename: string;
    }) => void;
    selectedOption?: { exerciseLocalId: number; exercisename: string } | null;
    placeholder?: string;
}

const CustomDropdown = ({
    options,
    onSelect,
    selectedOption,
    placeholder = "Select Option",
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useAppTheme();

    const filteredOptions = options.filter((option) =>
        option.exercisename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: theme.colors.buttonStandard },
                ]}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text
                    style={[
                        styles.buttonText,
                        { color: theme.colors.laserBlue },
                    ]}
                >
                    {selectedOption?.exercisename || placeholder}
                </Text>
            </TouchableOpacity>

            {isOpen && (
                <View
                    style={[
                        styles.dropdownContainer,
                        { backgroundColor: theme.colors.buttonStandard },
                    ]}
                >
                    <TextInput
                        style={[
                            styles.searchInput,
                            {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.paperWhite,
                            },
                        ]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder='Search exercises...'
                        placeholderTextColor={theme.colors.placeholder}
                    />
                    {Platform.OS === "android" ? (
                        <GestureScrollView
                            style={styles.optionsScroll}
                            contentContainerStyle={
                                styles.scrollContentContainer
                            }
                            keyboardShouldPersistTaps='handled'
                            bounces={false}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                        >
                            {filteredOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.exerciseLocalId}
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                        setSearchQuery("");
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            { color: theme.colors.paperWhite },
                                        ]}
                                    >
                                        {option.exercisename}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </GestureScrollView>
                    ) : (
                        <></>
                    )}
                    {Platform.OS === "ios" ? (
                        <RNScrollView
                            style={styles.optionsScroll}
                            contentContainerStyle={
                                styles.scrollContentContainer
                            }
                            keyboardShouldPersistTaps='handled'
                            bounces={false}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                        >
                            {filteredOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.exerciseLocalId}
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                        setSearchQuery("");
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            { color: theme.colors.paperWhite },
                                        ]}
                                    >
                                        {option.exercisename}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </RNScrollView>
                    ) : (
                        <></>
                    )}
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        //position: "relative",
        zIndex: 1000,
        width: "100%",
    },
    button: {
        padding: 12,
        borderRadius: 8,
        width: "100%",
    },
    buttonText: {
        fontSize: 16,
    },
    dropdownContainer: {
        // position: "absolute",
        // top: "100%",
        // left: 0,
        // right: 0,
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        //maxHeight: 300,
        width: "100%",
        zIndex: 1000,
    },
    searchInput: {
        padding: 8,
        borderRadius: 4,
        margin: 8,
        fontSize: 16,
    },
    optionsScroll: {
        maxHeight: 200,
        width: "100%",
    },
    scrollContentContainer: {
        flexGrow: 1,
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    optionText: {
        fontSize: 16,
    },
});

export default CustomDropdown;
