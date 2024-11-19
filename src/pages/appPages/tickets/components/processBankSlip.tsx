import { parse, format } from "date-fns";

export function ProcessBankSlip(barcode: string) {

    if (barcode.length !== 44) {
        throw new Error("O código de barras deve ter 44 dígitos.");
    }

    // Extrai o fator de vencimento (6º ao 9º dígito)
    const fatorVencimento = parseInt(barcode.substring(5, 9), 10);

    // Calcula a data de vencimento
    const baseDate = parse("1997-10-07", "yyyy-MM-dd", new Date());
    const vencimento = format(
        new Date(baseDate.getTime() + fatorVencimento * 24 * 60 * 60 * 1000),
        "dd/MM/yyyy"
    );

    // Extrai o valor (10º ao 19º dígito)
    const valor = parseFloat(
        (parseInt(barcode.substring(9, 19), 10) / 100).toFixed(2)
    ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return { vencimento, valor };
}