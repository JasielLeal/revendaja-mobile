import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomToastProps {
    type: 'success' | 'error';
    message: string;
    description: string;
}

export function CustomToast({ type, message, description }: CustomToastProps) {
    const isSuccess = type === 'success';

    return (
        <View className="flex flex-row items-center gap-3 p-4 bg-[#fff]/95 backdrop-blur-lg mx-[20px] rounded-xl w-[95%]">
            <View className={`${isSuccess ? 'bg-green-700' : 'bg-red-700'} p-2 rounded-xl`}>
                <Icon name={isSuccess ? "checkmark" : "close"} size={25} color={"#fff"} />
            </View>
            <View>
                <Text className={Platform.OS === 'ios' ? "text-black font-bold text-lg" : "text-black font-bold text-sm"}>{message}</Text>
                <Text className={Platform.OS === 'ios' ? "text-black text-sm" : "text-black text-xs"}>{description}</Text>
            </View>
        </View>
    );
}


