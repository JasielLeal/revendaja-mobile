import { api } from "@/app/backend/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateCustomProductBody {
  name: string;
  price: number;
  quantity: number;
  costPrice: number;
  imgUrl?: string; // URI da imagem
}

export function useCreateCustomProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomProductBody) => {
      // Sempre enviar multipart/form-data (arquivo opcional)
      const formData = new FormData();
      // Backend espera um campo `body` com JSON e `file` separado
      const body = {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        costPrice: data.costPrice,
      };
      formData.append("body", JSON.stringify(body));

      if (data.imgUrl) {
        const filename = data.imgUrl.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("file", {
          uri: data.imgUrl,
          name: filename,
          type: type,
        } as any);
      }

      console.log("Enviando formData:", formData);

      const response = await api.post("/store-products-custom", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-products"] });
    },
  });
}
