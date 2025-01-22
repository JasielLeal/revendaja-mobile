import { backend } from "@/api/backend";

export interface CreateSaleProsps {
    customer: string;
    paymentMethod : string;
    items: { barcode: string; quantity: number }[];
}

export async function CreateSale({ customer, items, paymentMethod  }: CreateSaleProsps) {
    const response = await backend.post('/sale/create', {
        customer,
        transactionType: paymentMethod ,
        items,
        status: 'Approved'
    })

    return response
}