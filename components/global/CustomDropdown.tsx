import { useAppTheme } from "@/app/_layout";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    LayoutAnimation,
    StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface CustomDropdownProps {
    options: Array<{ exerciseid: number; exercisename: string }>;
    onSelect: (option: { exerciseid: number; exercisename: string }) => void;
    selectedOption?: { exerciseid: number; exercisename: string } | null;
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
                    <View style={styles.optionsWrapper}>
                        <ScrollView
                            style={styles.optionsScroll}
                            keyboardShouldPersistTaps='handled'
                        >
                            {filteredOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.exerciseid}
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
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
    // return (
    //     <View style={styles.container}>
    //         <TouchableOpacity
    //             style={[
    //                 styles.button,
    //                 { backgroundColor: theme.colors.buttonStandard },
    //             ]}
    //             onPress={toggleDropdown}
    //         >
    //             <Text
    //                 style={[
    //                     styles.buttonText,
    //                     { color: theme.colors.laserBlue },
    //                 ]}
    //             >
    //                 {selectedOption?.exercisename || placeholder}
    //             </Text>
    //         </TouchableOpacity>

    //         {isOpen && (
    //             <View
    //                 style={[
    //                     styles.dropdown,
    //                     { backgroundColor: theme.colors.buttonStandard },
    //                 ]}
    //             >
    //                 <ScrollView contentContainerStyle={{ flex: 1 }}>
    //                     {options.map((option) => (
    //                         <TouchableOpacity
    //                             key={option.exerciseid}
    //                             style={styles.option}
    //                             onPress={() => {
    //                                 onSelect(option);
    //                                 setIsOpen(false);
    //                             }}
    //                         >
    //                             <Text
    //                                 style={[
    //                                     styles.optionText,
    //                                     { color: theme.colors.paperWhite },
    //                                 ]}
    //                             >
    //                                 {option.exercisename}
    //                             </Text>
    //                         </TouchableOpacity>
    //                     ))}
    //                 </ScrollView>
    //             </View>
    //         )}
    //     </View>
    // );
};
const styles = StyleSheet.create({
    container: {
        position: "relative",
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
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        maxHeight: 300,
        width: "100%",
        zIndex: 1000,
    },
    searchInput: {
        padding: 8,
        borderRadius: 4,
        margin: 8,
        fontSize: 16,
        maxHeight: 200,
    },
    optionsWrapper: {
        maxHeight: 200,
    },
    optionsScroll: {
        width: "100%",
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
// const styles = StyleSheet.create({
//     container: {
//         position: "relative",
//         zIndex: 1000,
//         width: "100%",
//     },
//     button: {
//         padding: 12,
//         borderRadius: 8,
//         width: "100%",
//     },
//     buttonText: {
//         fontSize: 16,
//     },
//     dropdown: {
//         position: "absolute",
//         top: "100%",
//         left: 0,
//         right: 0,
//         borderRadius: 8,
//         elevation: 5,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         maxHeight: 200,
//         width: "100%",
//         zIndex: 1000,
//     },
//     optionsContainer: {
//         width: "100%",
//     },
//     option: {
//         padding: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: "rgba(0,0,0,0.1)",
//         width: "100%",
//     },
//     optionText: {
//         fontSize: 16,
//     },
// });

export default CustomDropdown;
