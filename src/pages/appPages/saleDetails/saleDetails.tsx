import { formatCurrency } from '@/utils/formatCurrency';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { View, Text, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

export function SaleDetails({ route }: any) {
    const { sale } = route.params;
    const navigation = useNavigation();

    return (
        <View className='bg-bg w-full h-screen'>
            <View className='px-5 pt-16'>
                <View className='flex flex-row justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-back' size={20} color={"#fff"} />
                    </TouchableOpacity>
                    <Text className='text-white font-semibold'>Detalhes da Compra</Text>
                    <Text className='text-white w-[30px]'></Text>
                </View>

                <View className='flex flex-col justify-center items-center mt-7'>
                    <Text className="bg-[#303030] p-5 rounded-full">
                        <Icon name='checkmark' size={20} color={"#FF7100"} />
                    </Text>
                    <Text className='text-white font-medium mt-5'>R$ {formatCurrency((sale.totalPrice))}</Text>
                    <Text className='text-textForenground text-xs'>{sale.customer}</Text>
                    <Text className='text-xs bg-[#303030] font-medium py-1 mt-2 px-5 rounded-full text-white '>{sale.transactionType}</Text>
                </View>

                <View className='mt-7'>
                    <Text className='text-xs text-white font-medium'>Sobre a compra</Text>
                </View>

                <View className='bg-[#303030] p-3 rounded-xl mt-5'>
                    <View className='flex flex-row items-center justify-between'>
                        <Text className='text-white text-xs'>Data</Text>
                        <Text className='text-textForenground text-[10px] capitalize'>{format(new Date(sale.createdAt), "dd/MM/yyyy")}</Text>
                    </View>
                    <View className='flex flex-row items-center justify-between mt-2'>
                        <Text className='text-white text-xs'>Nome</Text>
                        <Text className='text-textForenground text-xs'>{sale.customer}</Text>
                    </View>
                    <View className='flex flex-row items-center justify-between mt-2'>
                        <Text className='text-white text-xs'>Forma de Pagamento</Text>
                        <Text className='text-textForenground text-xs'>{sale.transactionType}</Text>
                    </View>
                    <View className='flex flex-row items-center justify-between mt-2'>
                        <Text className='text-white text-xs'>ID</Text>
                        <Text className='text-textForenground text-[10px]'>{sale.id}</Text>
                    </View>
                </View>

                <Text className='text-white text-xs font-medium my-5'>Produtos</Text>

                <View>
                    {sale.saleItems.map((product: any) => (
                        <View key={product.id} className='flex flex-row items-center justify-between bg-[#303030] p-3 rounded-xl mb-2'>
                            <View className='flex flex-row items-center'>
                                
                                <Text className='text-white mr-3 text-xs'>{product.quantity}x</Text>
                                <Text className='text-white w-[140px] text-xs' numberOfLines={1} ellipsizeMode="tail">
                                    {product.stock.customProduct?.name || product.stock.product?.name}
                                </Text>
                            </View>
                            <Text className='text-white text-xs'>R$ {formatCurrency((product.price))}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}