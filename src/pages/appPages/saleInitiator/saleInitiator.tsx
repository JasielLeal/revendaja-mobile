import { Input } from "@/components/input";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScannerScreen } from "./components/ScannerScreen";
import Icon from 'react-native-vector-icons/Ionicons'
import { useMutation } from "@tanstack/react-query";
import { FindProductsByBarcode } from "./services/findProductsByBarcode";
import { useState } from "react";
import axios from "axios";
import { formatCurrency } from "@/utils/formatCurrency";

export function SaleInitiator() {

    async function handleScan(code: string) {
        console.log(code)
    }

    interface ProductProps {
        id: string
        name: string;
        price: string;
        brand: string;
        quantity: Number;
        imageUrl?: string;
        barcode: string
    }

    const [inputValue, setInputValue] = useState('');
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [productsBack, setProductsBack] = useState<{ barcode: string; amount: number }[]>([]);
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
                    imageUrl: response.data.customProduct.imgUrl,
                }
                : {
                    id: response.data.product.id,
                    name: response.data.product.name,
                    price: response.data.customPrice,
                    barcode: response.data.product.barcode,
                    imageUrl: response.data.product.imgUrl,
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

                updatedProductBack[existingProductIndex].amount = Number(
                    Number(updatedProductBack[existingProductIndex].amount) + Number(newInputValue)
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
                    imageUrl: productData.imageUrl,
                };
                const productBack = { barcode: productData.barcode, amount: Number(newInputValue) };

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

    return (
        <>
            <View className='bg-bg w-full h-screen'>
                <View className="px-5">
                    <Text className='text-white font-semibold text-center mt-16 text-lg'>Iniciar venda</Text>

                    <View className="mt-5 mb-5">
                        <Input name="Nome do cliente" placeholder="Nome do Cliente" />
                    </View>
                    <View className="mb-5">
                        <Input name="Nome do cliente" placeholder="Forma de pagamento" />
                    </View>
                    <View className="flex flex-row items-center justify-between">
                        <View className="w-4/5 ">
                            <Input name="Codigo de barras" placeholder="Codigo de barras do produto" />
                        </View>
                        <View >
                            <ScannerScreen onScan={handleScan} />
                        </View>
                    </View>

                    <View className="mt-5 mb-5 flex flex-row">
                        <Text className="text-white font-medium">
                            Produto
                        </Text>
                    </View>

                    {
                        products.map((item) => (
                            <View className="flex flex-row items-center justify-between mb-5">
                                <View className="flex flex-row gap-2">
                                    <Image
                                        source={require("@/assets/kaiak.jpg")}
                                        className="w-[60px] h-[60px] rounded-xl"
                                    />
                                    <View>
                                        <Text className="text-white font-semibold">
                                            {item.name}
                                        </Text>
                                        <View className="flex flex-row items-center gap-1">
                                            <Text className="text-white text-lg font-semibold">
                                                R$ {formatCurrency(item.price)}
                                            </Text>
                                        </View>
                                        <Text className="text-primaryPrimary">
                                            {item?.quantity}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <TouchableOpacity onPress={() => handleRemoveProduct(item.id, item.barcode)}>
                                        <Icon name="trash" color={"#dc2626"} size={20} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        ))
                    }



                </View>
            </View>
        </>
    )
}