import { RootStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Text } from 'react-native'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import SelectCompany from './selectCompany'
import { Input } from '@/components/input'
import { Button } from '@/components/buttton'
import { ScannerScreen } from './ScannerScreen'
import { ProcessBankSlip } from './processBankSlip'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddBankSlipSchema } from '../schemas/AddBankSlipSchema'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateBankSlip } from '../services/CreateBankSlip'
import { useSuccess } from '@/context/successContext'
import React from 'react'

export function AddBankSlip() {
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();

    const { control, handleSubmit, setValue } = useForm({
        resolver: zodResolver(AddBankSlipSchema),
        mode: 'onSubmit',
        criteriaMode: 'all',
        defaultValues: {
            barcode: '',
            dueDate: '',
            value: '',
            companyName: '',
        },
    });

    const options = [
        { label: 'Natura', value: 'Natura' },
        { label: 'O Boticário', value: 'Oboticario' },
        { label: 'Avon', value: 'Avon' },
    ];

    const handleScan = async (code: string) => {
        try {
            const { vencimento, valor } = ProcessBankSlip(code);
            setValue('barcode', code); // Atualiza o código de barras no formulário
            setValue('dueDate', vencimento); // Atualiza a data de vencimento
            setValue('value', valor); // Atualiza o valor do boleto
        } catch (error) {
            console.error("Erro ao processar o boleto", error);
        }
    };

    const queryClient = useQueryClient();
    const { displaySuccess } = useSuccess()

    const { mutateAsync: CreateBankSlipFn } = useMutation({
        mutationFn: CreateBankSlip,
        onSuccess: () => {
            displaySuccess()
            setTimeout(() => navigate.navigate('tickets'), 1000)
            queryClient.invalidateQueries(['ListAllStoreByStore'] as InvalidateQueryFilters);
        
        },
        onError: () => {
         
        }
    })

    async function onSub(data: FieldValues) {
        const { barcode, companyName, dueDate, value } = data;

        // Convertendo a data de vencimento para o formato ISO completo (YYYY-MM-DD HH:mm:ss.SSSZ)
        const [day, month, year] = dueDate.split('/');
        const dueDateObj = new Date(`${year}-${month}-${day}T00:00:00Z`);
        const isoDueDate = dueDateObj.toISOString().replace('T', ' ').split('.')[0] + '.' + dueDateObj.getMilliseconds().toString().padStart(3, '0') + 'Z';

        // Convertendo o valor para centavos (removendo "R$" e a vírgula)
        const numericValue = Math.round(
            parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) * 100
        );

        // Objeto final com os dados transformados
        const formattedData = {
            barcode,
            companyName,
            dueDate: isoDueDate, // Data no formato ISO completo com milissegundos
            value: numericValue, // Valor em centavos
        };

        await CreateBankSlipFn(formattedData)

        // Aqui você pode realizar o restante das operações, como enviar os dados para o backend
    }



    return (
        <View className="bg-bg flex-1 w-full px-5 justify-between">
            <View>
                <View className="flex flex-row items-center mt-16 mb-5 justify-between">
                    <TouchableOpacity onPress={() => navigate.goBack()}>
                        <Icon name="chevron-back" color={"#fff"} size={20} />
                    </TouchableOpacity>
                    <Text className="text-white font-medium text-lg text-center ">Adicionar Boleto</Text>
                    <Text className="w-9"></Text>
                </View>
                <View>
                    <View className="flex flex-row items-center justify-between mb-2 mt-5">
                        <Text className="text-white">Digite o código de barras</Text>
                        {/* Scanner que chama o handleScan */}
                        <ScannerScreen onScan={handleScan} />
                    </View>

                    {/* Controller para código de barras */}
                    <Controller
                        control={control}
                        name="barcode"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                name="Código de barras"
                                value={value} // Usa o valor do formulário
                                onChangeText={onChange} // Atualiza o valor do formulário
                                onBlur={onBlur} // Para edição manual
                                keyboardType="number-pad"
                            />
                        )}
                    />
                </View>

                <View className="mt-2">
                    <Text className="text-white mb-2 mt-5">Data de vencimento</Text>
                    {/* Controller para data de vencimento */}
                    <Controller
                        control={control}
                        name="dueDate"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                name="Data de vencimento"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                </View>

                <View className="mt-2">
                    <Text className="text-white mb-2 mt-5">Valor do boleto</Text>
                    {/* Controller para valor */}
                    <Controller
                        control={control}
                        name="value"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                name="Valor do boleto"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType="decimal-pad"
                            />
                        )}
                    />
                </View>

                <View className="mt-7">
                    <Controller
                        control={control}
                        name="companyName"
                        render={({ field: { value }, fieldState: { error } }) => (
                            <>
                                <SelectCompany
                                    label="Escolha a empresa emissora"
                                    onSelect={(selectedValue) => setValue('companyName', selectedValue)}
                                    options={options}
                                    value={value}
                                />
                                {error && <Text className="text-red-500">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>
            </View>
            <View className="mb-16">
                <Button name="Criar" onPress={handleSubmit(onSub)} />
            </View>
        </View>
    );
}


