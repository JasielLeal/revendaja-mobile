import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function InsertCustomProductToStock(data: FieldValues) {
    const formData = new FormData();

    // Adiciona o arquivo da imagem ao FormData
    if (data.image) {
        formData.append("image", {
            uri: data.image, // Caminho do arquivo (URI da imagem no React Native)
            type: "image/png", // Tipo do arquivo (ajuste conforme necessário)
            name: `${data.name.replace(/\s+/g, "_")}.png`, // Nome do arquivo
        } as any); // O `as any` é necessário no TypeScript devido ao formato esperado no React Native.
    }

    // Adiciona os outros campos ao FormData
    formData.append("name", data.name);
    formData.append("normalPrice", data.normalPrice);
    formData.append("description", data.description);
    formData.append("suggestedPrice", data.suggestedPrice);
    formData.append("barcode", data.barcode);
    formData.append("quantity", data.quantity.toString()); // Converte para string, já que FormData aceita somente strings ou blobs.


    // Envia os dados para o backend usando o axios
    const response = await backend.post("/customproduct/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response

}
