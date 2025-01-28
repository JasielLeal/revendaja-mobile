import { Input } from "@/components/input";
import { Alert, Dimensions, FlatList, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { ScannerScreen } from "./components/ScannerScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { FindProductsByBarcode } from "./services/findProductsByBarcode";
import { useState } from "react";
import axios from "axios";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { Button } from "@/components/buttton";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { CreateSale } from "./services/createSale";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SelectPaymentMethod } from "./components/select";


export function SaleInitiator() {
    const tabBarHeight = useBottomTabBarHeight();

    interface Product {
        id: string;
        name: string;
        price: string;
        brand: string;
        quantity: number;
        imgUrl?: string;
        barcode: string;
    }

    const insets = useSafeAreaInsets();
    const [barcodeInput, setBarcodeInput] = useState('');
    const [productList, setProductList] = useState<Product[]>([]);
    const [backendProductList, setBackendProductList] = useState<{ barcode: string; quantity: number }[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const queryClient = useQueryClient();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const { mutateAsync: fetchProductByBarcode } = useMutation({
        mutationFn: FindProductsByBarcode,
        onSuccess: (response) => {
            const quantity = barcodeInput || '1';
            const isCustomProduct = !!response.data.customProduct;

            const productData = isCustomProduct
                ? {
                    id: response.data.customProduct.id,
                    name: response.data.customProduct.name,
                    price: response.data.customPrice,
                    barcode: response.data.customProduct.barcode,
                    imgUrl: response.data.customProduct.imgUrl,
                }
                : {
                    id: response.data.product.id,
                    name: response.data.product.name,
                    price: response.data.customPrice,
                    barcode: response.data.product.barcode,
                    imgUrl: response.data.product.imgUrl,
                };

            const existingProductIndex = productList.findIndex(
                (product) => product.id === productData.id
            );

            if (existingProductIndex >= 0) {
                const updatedProductList = [...productList];
                const updatedBackendProductList = [...backendProductList];

                updatedProductList[existingProductIndex].quantity += Number(quantity);
                updatedBackendProductList[existingProductIndex].quantity += Number(quantity);

                setProductList(updatedProductList);
                setBackendProductList(updatedBackendProductList);
            } else {
                const newProduct = {
                    id: productData.id,
                    quantity: Number(quantity),
                    name: productData.name,
                    price: productData.price,
                    barcode: productData.barcode,
                    imgUrl: productData.imgUrl,
                };
                const newBackendProduct = { barcode: productData.barcode, quantity: Number(quantity) };

                setProductList([...productList, newProduct]);
                setBackendProductList([...backendProductList, newBackendProduct]);
            }

            setBarcodeInput('');
        },
        onError: (error) => {

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

            }
        },
    });

    const removeProduct = (productId: string, productBarcode: string) => {
        setProductList(productList.filter((product) => product.id !== productId));
        setBackendProductList(backendProductList.filter((product) => product.barcode !== productBarcode));
    };

    const addProductToList = async (barcode: string) => {
       
        await fetchProductByBarcode(barcode);
    };

    const calculateTotal = () => {
        const total = productList.reduce((acc, product) => {
            if (!product.quantity || !product.price) return acc;
            return acc + (Number(product.quantity) * Number(product.price) / 100);
        }, 0);
        return `R$ ${formatCurrency(total.toFixed(2))}`;
    };

    const { mutateAsync: createSale } = useMutation({
        mutationFn: CreateSale,
        onSuccess: () => {
            setTimeout(() => {
                navigation.navigate('Extract');
            }, 1000);
            queryClient.invalidateQueries(['GetSales'] as InvalidateQueryFilters);
            queryClient.invalidateQueries(['MonthlyValue'] as InvalidateQueryFilters);
            queryClient.invalidateQueries(['GetStock'] as InvalidateQueryFilters);
            setProductList([]);
            setBackendProductList([]);
            setCustomerName('');
        },
        onError: (error) => {
            Alert.alert("Error", `${error}`);
        },
    });

    const handleCreateSale = async () => {
        if (!customerName) {
            Alert.alert("Por Favor, Insira o Nome do Cliente", 'Para prosseguir, informe o nome do cliente no formulário.');
            return;
        }

        if (backendProductList.length === 0) {
            Alert.alert("Por Favor, Insira um produto", 'Para prosseguir, adicione algum produto.');
            return;
        }

        await createSale({ customer: customerName, items: backendProductList, paymentMethod });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <View className='bg-bg w-full h-screen'>
            <View className="px-5 flex justify-between flex-1">
                <View>
                    <Text className='text-white font-semibold text-center mt-16 text-lg'>Iniciar venda</Text>
                    <View className="mt-5 mb-5">
                        <Input
                            name="Nome do cliente"
                            placeholder="Nome do Cliente"
                            value={customerName}
                            onChangeText={setCustomerName}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => setIsModalOpen(!isModalOpen)}
                        className={Platform.OS === 'ios' ? `bg-forenground p-4 rounded-xl mb-5 flex flex-row justify-between` : `mb-0`}
                    >
                        <Text className={Platform.OS === 'ios' ? ` text-textForenground` : `mb-0`}>
                            {paymentMethod ? paymentMethod : "Selecionar forma de pagamento"}
                        </Text>
                        <Text className={Platform.OS === 'ios' ? ` text-textForenground` : `mb-0`}>
                            <Icon name="chevron-down" />
                        </Text>
                    </TouchableOpacity>

                    <View className="flex flex-row items-center justify-between">
                        <View className="w-4/5">
                            <Input name="Codigo de barras" placeholder="Codigo de barras do produto" />
                        </View>
                        <ScannerScreen onScan={addProductToList} />
                    </View>
                    <FlatList
                        data={productList}
                        className="mt-10"
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="flex flex-row justify-between mb-5">
                                {
                                    Platform.OS === 'ios' ?
                                        <View className="flex flex-row gap-2">
                                            <Image
                                                source={item.imgUrl ? { uri: item.imgUrl } : require("@/assets/kaiak.jpg")}
                                                className="w-[60px] h-[60px] rounded-xl"
                                            />
                                            <View>
                                                <Text className="text-white font-semibold w-[200px]" numberOfLines={1} ellipsizeMode="tail">
                                                    {item.name}
                                                </Text>
                                                <View className="flex flex-row items-center gap-1">
                                                    <Text className="text-white text-lg font-semibold">
                                                        R$ {formatCurrency(item?.price)}
                                                    </Text>
                                                </View>
                                                <Text className="text-primaryPrimary">
                                                    Quantidade: {String(item?.quantity)}
                                                </Text>
                                            </View>
                                        </View> :
                                        <View className="flex flex-row gap-2">
                                            <Image
                                                source={item.imgUrl ? { uri: item.imgUrl } : require("@/assets/kaiak.jpg")}
                                                className="w-[60px] h-[60px] rounded-xl"
                                            />
                                            <View>
                                                <Text className="text-white text-sm font-semibold w-[200px]" numberOfLines={1} ellipsizeMode="tail">
                                                    {item.name}
                                                </Text>
                                                <View className="flex flex-row items-center gap-1">
                                                    <Text className="text-white text-sm font-semibold">
                                                        R$ {formatCurrency(item.price)}
                                                    </Text>
                                                </View>
                                                <Text className="text-primaryPrimary text-sm">
                                                    Quantidade: {String(item.quantity)}
                                                </Text>
                                            </View>
                                        </View>
                                }
                                <TouchableOpacity onPress={() => removeProduct(item.id, item.barcode)}>
                                    <Icon name="trash" color={"#dc2626"} size={20} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
                <View className={Platform.OS === 'ios' ? `mb-5` : `mb-${insets.bottom}`}>
                    <View className="flex flex-row mt-5 items-center justify-between mb-3">
                        <Text className='text-white font-medium text-base'>Valor total</Text>
                        <Text className='text-white font-medium text-base'>{calculateTotal()}</Text>
                    </View>
                    <Button name="Finalizar Venda" onPress={handleCreateSale} style={{ marginBottom: tabBarHeight }} />
                </View>
            </View>
            <SelectPaymentMethod open={isModalOpen} onSelectPaymentMethod={setPaymentMethod} />
        </View>


    );
}