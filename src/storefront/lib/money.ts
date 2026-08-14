export function formatMoney(amount: number | null | undefined, currency = 'EUR'): string {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: String(currency).toUpperCase(),
  }).format(Number(amount))
}

export function cartCurrency(cart?: { region?: { currency_code?: string } } | null): string {
  return cart?.region?.currency_code || 'EUR'
}
