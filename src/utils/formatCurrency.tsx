export const formatCurrency = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  const formattedValue = (Number(cleanValue) / 100).toFixed(2);
  return formattedValue.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
