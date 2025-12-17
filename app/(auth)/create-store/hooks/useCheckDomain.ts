import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";

interface DomainAvailabilityResponse {
  available: boolean;
}

export const useCheckDomain = (domain: string) => {
  return useQuery({
    queryKey: ["domain-availability", domain],
    queryFn: async () => {
      const response = await api.get<DomainAvailabilityResponse>(
        `/stores/domain-availability/${domain}`
      );
      return response.data;
    },
    enabled: domain.length >= 3,
    staleTime: 1000 * 60, // 1 minuto
    retry: false,
  });
};

export const formatDomain = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]/g, ""); // Remove caracteres especiais e espaços
};
