import { backend } from "@/api/backend";

export interface CreateSaleProsps {
    customer: string;
    selectedValue: string;
    items: { barcode: string; quantity: number }[];
}

export async function CreateSale({ customer, items, selectedValue }: CreateSaleProsps) {
    const response = await backend.post('/sale/create', {
        customer,
        transactionType: selectedValue,
        items,
        status: 'Aproved'
    })

    return response
}