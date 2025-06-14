export const formatCurrencyInCents = (amout: number) => {
  return new Intl.NumberFormat("pt-Br", {
    style: "currency",
    currency: "BRL",
  }).format(amout / 100);
};
