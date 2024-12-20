import { Input } from "@/components/input";
import { Alert, FlatList, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { ScannerScreen } from "./components/ScannerScreen";
import Icon from 'react-native-vector-icons/Ionicons'
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { FindProductsByBarcode } from "./services/findProductsByBarcode";
import { useState } from "react";
import axios from "axios";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { Button } from "@/components/buttton";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { CreateSale } from "./services/createSale";
import { useSuccess } from "@/context/successContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

export function SaleInitiator() {

    const tabBarHeight = useBottomTabBarHeight();

    interface ProductProps {
        id: string
        name: string;
        price: string;
        brand: string;
        quantity: Number;
        imgUrl?: string;
        barcode: string
    }

    const [inputValue, setInputValue] = useState('');
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [productsBack, setProductsBack] = useState<{ barcode: string; quantity: number }[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [selectedValue, setSelectedValue] = useState('Pix');
    const queryClient = useQueryClient();
    const { displaySuccess } = useSuccess()

    const { mutateAsync: FindProductsByBarcodeFn } = useMutation({
        mutationFn: FindProductsByBarcode,
        onSuccess: (response) => {
            const newInputValue = inputValue || '1'; // Quantidade padrão
            // Determina se é um produto do sistema ou personalizado
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

            // Verifica se o produto já existe na lista com base no ID
            const existingProductIndex = products.findIndex(
                (product) => product.id === productData.id
            );

            if (existingProductIndex >= 0) {

                // Produto já existe: atualiza quantidade
                const updatedProducts = [...products];
                const updatedProductBack = [...productsBack];

                updatedProducts[existingProductIndex].quantity = Number(
                    Number(updatedProducts[existingProductIndex].quantity) + Number(newInputValue)
                );

                updatedProductBack[existingProductIndex].quantity = Number(
                    Number(updatedProductBack[existingProductIndex].quantity) + Number(newInputValue)
                );

                setProducts(updatedProducts);
                setProductsBack(updatedProductBack);
            } else {
                // Produto novo: adiciona à lista
                const product = {
                    id: productData.id,
                    quantity: Number(newInputValue),
                    name: productData.name,
                    price: productData.price,
                    barcode: productData.barcode,
                    imgUrl: productData.imgUrl,
                };
                const productBack = { barcode: productData.barcode, quantity: Number(newInputValue) };

                setProducts([...products, product]);
                setProductsBack([...productsBack, productBack]);
            }

            setInputValue(''); // Limpa o campo de entrada
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
            }
        },
    })

    const handleRemoveProduct = (productId: string, productCode: string) => {

        // Remove o produto da lista visual
        const updatedProducts = products.filter((product) => product.id !== productId);
        setProducts(updatedProducts);

        // Remove o produto da lista que será enviada ao backend
        const updatedProductsBack = productsBack.filter((product) => product.barcode !== productCode);
        setProductsBack(updatedProductsBack);

    };

    const addProductList = async (code: string) => {
        await FindProductsByBarcodeFn(code)
    };

    const calcularTotalGeral = () => {
        const total = products.reduce((acc, product) => {
            if (!product.quantity || !product.price) return acc;
            return acc + (Number(product.quantity) * Number(product.price) / 100);
        }, 0);
        return `R$ ${formatCurrency(total.toFixed(2))}`;
    };

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    const { mutateAsync: CreateSaleFn } = useMutation({
        mutationFn: CreateSale,
        onSuccess: () => {
            setTimeout(() => {
                navigate.navigate('Extract')
            }, 1000);
            queryClient.invalidateQueries(['GetSales'] as InvalidateQueryFilters);
            queryClient.invalidateQueries(['MonthlyValue'] as InvalidateQueryFilters);
            setProducts([]);
            setProductsBack([]);
            setCustomerName('');

            //redirecionar para a venda que acabou de ser feita.
        },
        onError: (error) => {
            Alert.alert("Error", `${error}`);
        },
    })

    const handleCreateSale = async () => {
        await CreateSaleFn({ customer: customerName, items: productsBack, selectedValue })
    }

    return (
        <>
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
                        <View className="mb-5">
                            <Input
                                name="Forma de pagamento"
                                placeholder="Forma de pagamento"
                                value={selectedValue}
                                onChangeText={setSelectedValue}
                            />
                        </View>
                        <View className="flex flex-row items-center justify-between">
                            <View className="w-4/5 ">
                                <Input name="Codigo de barras" placeholder="Codigo de barras do produto" />
                            </View>
                            <View >
                                <ScannerScreen onScan={addProductList} />
                            </View>
                        </View>

                        <FlatList
                            data={products}
                            className="mt-10"
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View className="flex flex-row justify-between mb-5">
                                    {
                                        Platform.OS === 'ios' ?

                                            <>
                                                <View className="flex flex-row gap-2">
                                                    <Image
                                                        source={item.imgUrl ? { uri: item.imgUrl } : require("@/assets/kaiak.jpg")}
                                                        className="w-[60px] h-[60px] rounded-xl"
                                                    />
                                                    <View>
                                                        <Text className="text-white font-semibold w-[200px]" numberOfLines={1} ellipsizeMode="tail" >
                                                            {item.name}
                                                        </Text>
                                                        <View className="flex flex-row items-center gap-1">
                                                            <Text className="text-white text-lg font-semibold">
                                                                R$ {formatCurrency(item.price)}
                                                            </Text>
                                                        </View>
                                                        <Text className="text-primaryPrimary">
                                                            Quantidade: {String(item?.quantity)}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View>
                                                    <TouchableOpacity onPress={() => handleRemoveProduct(item.id, item.barcode)}>
                                                        <Icon name="trash" color={"#dc2626"} size={20} />
                                                    </TouchableOpacity>
                                                </View>
                                            </>

                                            :

                                            <>
                                                <View className="flex flex-row gap-2">
                                                    <Image
                                                        source={item.imgUrl ? { uri: item.imgUrl } : require("@/assets/kaiak.jpg")}
                                                        className="w-[60px] h-[60px] rounded-xl"
                                                    />
                                                    <View>
                                                        <Text className="text-white font-semibold text-xs w-[200px]" numberOfLines={1} ellipsizeMode="tail" >
                                                            {item.name}
                                                        </Text>
                                                        <View className="flex flex-row items-center gap-1">
                                                            <Text className="text-white text-sm font-semibold">
                                                                R$ {formatCurrency(item.price)}
                                                            </Text>
                                                        </View>
                                                        <Text className="text-primaryPrimary text-sm">
                                                            Quantidade: {String(item?.quantity)}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View>
                                                    <TouchableOpacity onPress={() => handleRemoveProduct(item.id, item.barcode)}>
                                                        <Icon name="trash" color={"#dc2626"} size={20} />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                    }
                                </View>
                            )}
                        />
                    </View>

                    <View className={Platform.OS === 'ios' ? 'mb-5' : ''}>
                        <View className="flex flex-row mt-5 items-center justify-between mb-3">
                            <Text className='text-white font-medium text-base'>Valor total</Text>
                            <Text className='text-white font-medium text-base'>{calcularTotalGeral()}</Text>
                        </View>
                        <Button name="Finalizar Venda" onPress={handleCreateSale} style={{ marginBottom: tabBarHeight }} />
                    </View>
                </View>
            </View>
        </>
    )
}