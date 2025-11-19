/**
 * Formata um valor numérico para moeda brasileira
 * @param value - Valor em centavos (ex: 15000 = R$ 150,00)
 * @returns String formatada (ex: "R$ 150,00")
 */
export const formatCurrency = (value: number): string => {
  const valueInReais = value / 100;
  return valueInReais.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

/**
 * Formata uma data para o formato brasileiro curto
 * @param date - String de data ISO ou objeto Date
 * @returns String formatada (ex: "19/nov")
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const day = dateObj.getDate();
  const month = dateObj
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");

  return `${day}/${month}`;
};

/**
 * Formata uma data para o formato brasileiro completo
 * @param date - String de data ISO ou objeto Date
 * @returns String formatada (ex: "19/11/2025")
 */
export const formatDateFull = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("pt-BR");
};
