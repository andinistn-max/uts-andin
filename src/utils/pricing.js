export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const TAX_RATE = 0.1;

// KOPI15 hanya berlaku untuk menu kategori Kopi
export const PROMOS = {
  UTS25: { rate: 0.25, label: "Diskon 25%" },
  HEMAT10: { rate: 0.1, label: "Diskon 10%" },
  KOPI15: { rate: 0.15, label: "Diskon 15% menu Kopi", category: "Kopi" },
};

export function calcTotals(lines, code) {
  const subtotal = lines.reduce((t, l) => t + l.price * l.qty, 0);
  const promo = PROMOS[code];
  const eligible = lines
    .filter((l) => !promo?.category || l.category === promo.category)
    .reduce((t, l) => t + l.price * l.qty, 0);
  const discount = promo ? Math.round(eligible * promo.rate) : 0;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

export const formatDate = (ms) =>
  new Date(ms).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
