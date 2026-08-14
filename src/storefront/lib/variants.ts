import type { Product } from './products'

function optionValue(option: any): string {
  return String(option?.value || option?.option_value || '').toLowerCase()
}

export function findVariantId(product: Product, size?: string, color?: string): string | null {
  const variants = product.variants || []
  if (!variants.length) return null

  const wantedSize = size?.toLowerCase()
  const wantedColor = color?.toLowerCase()

  const exact = variants.find((variant: any) => {
    const values = (variant.options || []).map(optionValue)
    const sizeOk = !wantedSize || values.includes(wantedSize)
    const colorOk = !wantedColor || values.includes(wantedColor)
    return sizeOk && colorOk
  })

  return exact?.id || variants[0]?.id || null
}

export function variantOption(variant: any, title: string): string {
  const match = (variant?.options || []).find((option: any) => {
    const optionTitle = String(option.title || option.option?.title || '').toLowerCase()
    return optionTitle === title.toLowerCase()
  })
  return match?.value || ''
}
