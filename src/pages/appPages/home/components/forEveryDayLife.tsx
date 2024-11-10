import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export function ForEveryDayLife() {
    const items = [
        { name: 'receipt-outline', label: 'Extrato' },
        { name: 'barcode-outline', label: 'Boletos' },
        { name: 'flag-outline', label: 'Metas' },
        { name: 'archive-outline', label: 'Estoque' },
    ];

    return (
        <View className='flex flex-row justify-between my-7 px-5'>
            {items.map((item, index) => (
                <View key={index} className='flex items-center'>
                    <View className='bg-[#303030] p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-2'>
                        <Icon name={item.name} size={20} color={"#fff"} />
                    </View>
                    <Text className='text-white font-medium text-sm'>
                        {item.label}
                    </Text>
                </View>
            ))}
        </View>
    );
}
