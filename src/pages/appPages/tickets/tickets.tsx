import { Text, View } from "react-native";
import { ScannerScreen } from "./components/ScannerScreen";
import { ProcessBankSlip } from "./components/processBankSlip";


export function Tickets() {

    const handleScan = async (code: string) => {
        try {
            const { vencimento, valor } = ProcessBankSlip(code);
            console.log(`Data de vencimento: ${vencimento}`);
            console.log(`Valor: ${valor}`);
        } catch (error) {
            console.error("Erro ao processar o boleto");
        }
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