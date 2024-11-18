import { Text, View } from "react-native";
import { ScannerScreen } from "./components/ScannerScreen";
import { FieldValues } from "react-hook-form";


export function Tickets() {

    const handleScan = async (code: FieldValues) => {
        console.log(code)
    };

    return (
        <View className="bg-bg h-screen w-full px-5">
            <View>
                <Text className="text-white font-medium mt-16 text-lg text-center mb-5">Boletos</Text>
                <ScannerScreen onScan={handleScan} />
            </View>
        </View>
    )
}