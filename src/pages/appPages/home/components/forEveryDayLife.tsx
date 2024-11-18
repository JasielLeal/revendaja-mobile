import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export function ForEveryDayLife() {
    const items = [
        { id: 1, name: 'receipt-outline', label: 'Extrato', navigate: "Extrato" },
        { id: 2, name: 'barcode-outline', label: 'Boletos', navigate: "tickets" },
        { id: 3, name: 'flag-outline', label: 'Metas', navigate: "goals" },
        { id: 4, name: 'archive-outline', label: 'Estoque', navigate: "stock" },
    ];

    const navigate = useNavigation()

    return (
        <View className='flex flex-row justify-between my-7 px-5'>
            {items.map((item, index) => (
                <TouchableOpacity key={item.id} onPress={() => navigate.navigate(`${item.navigate}`)}>
                    <View  className='flex items-center'>
                        <View className='bg-[#303030] p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-2'>
                            <Icon name={item.name} size={20} color={"#fff"} />
                        </View>
                        <Text className='text-white font-medium text-sm'>
                            {item.label}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}
