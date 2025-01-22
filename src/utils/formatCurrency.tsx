export const formatCurrency = (value: string | number) => {
  if (value === undefined || value === null) {
    console.warn("formatCurrency: valor é undefined ou null.");
    return "0,00"; // Retorna um valor padrão
  }

  // Garante que o valor seja uma string
  const stringValue = typeof value === "number" ? value.toString() : value;

  const cleanValue = stringValue.replace(/\D/g, "");
  const formattedValue = (Number(cleanValue) / 100).toFixed(2);
  return formattedValue.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
