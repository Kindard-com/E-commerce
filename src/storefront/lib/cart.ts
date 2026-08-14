import { medusaClient, SALES_CHANNEL_ID } from './medusa';
import { mapMedusaProduct } from './medusa-mapper';
import type { Product } from './products';
import { variantOption } from './variants';

export type CartItem = {
  lineItemId?: string;
  variantId?: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
};

const CART_FIELDS =
  '*items,*items.variant,*items.product,*items.variant.options,*items.variant.product,*region'

export function applyCustomerToken() {
  if (typeof window === 'undefined') return
  const token = localStorage.getItem('medusa_token')
  if (token) {
    medusaClient.client.setToken(token)
  } else {
    medusaClient.client.setToken('')
  }
}

export function mapCartItems(cart: any): CartItem[] {
  return (cart?.items || []).map((item: any) => {
    const productSource = item.variant?.product || item.product || {
      id: item.product_id || item.variant_id,
      title: item.title,
      thumbnail: item.thumbnail,
      variants: item.variant ? [item.variant] : [],
    }
    const product = mapMedusaProduct({
      ...productSource,
      thumbnail: productSource.thumbnail || item.thumbnail,
    })
    return {
      lineItemId: item.id,
      variantId: item.variant_id,
      product,
      size: variantOption(item.variant, 'Size') || item.variant?.title || '',
      color: variantOption(item.variant, 'Color') || '',
      qty: item.quantity,
    } satisfies CartItem
  })
}

export async function initMedusaCart(forceNew = false) {
  applyCustomerToken()
  let cartId = typeof window !== 'undefined' && !forceNew ? localStorage.getItem('cart_id') : null;

  try {
    if (cartId) {
      const { cart } = await medusaClient.store.cart.retrieve(cartId, { fields: CART_FIELDS });
      return cart;
    }
  } catch (err) {
    console.error("Failed to retrieve existing cart, creating new one", err);
    if (typeof window !== 'undefined') localStorage.removeItem('cart_id');
  }

  try {
    const { regions } = await medusaClient.store.region.list()
    const regionId = regions?.[0]?.id
    const { cart } = await medusaClient.store.cart.create({
      ...(regionId ? { region_id: regionId } : {}),
      ...(SALES_CHANNEL_ID ? { sales_channel_id: SALES_CHANNEL_ID } : {}),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart_id', cart.id);
    }
    return cart;
  } catch (err) {
    console.error("Failed to create Medusa cart", err);
    return null;
  }
}

export async function addLineItemToMedusa(cartId: string, variantId: string, quantity: number) {
  applyCustomerToken()
  try {
    const { cart } = await medusaClient.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return cart;
  } catch (err) {
    console.error("Failed to add item to Medusa cart, attempting to recreate cart", err);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart_id');
      const newCart = await initMedusaCart(true);
      if (newCart) {
        const { cart } = await medusaClient.store.cart.createLineItem(newCart.id, {
          variant_id: variantId,
          quantity,
        });
        return cart;
      }
    }
    throw err;
  }
}

export async function removeLineItemFromMedusa(cartId: string, lineItemId: string) {
  applyCustomerToken()
  try {
    const { cart } = await medusaClient.store.cart.deleteLineItem(cartId, lineItemId);
    return cart;
  } catch (err) {
    console.error("Failed to remove item from Medusa cart", err);
    throw err;
  }
}

export async function updateLineItemInMedusa(cartId: string, lineItemId: string, quantity: number) {
  applyCustomerToken()
  try {
    if (quantity < 1) {
      return removeLineItemFromMedusa(cartId, lineItemId)
    }
    const { cart } = await medusaClient.store.cart.updateLineItem(cartId, lineItemId, { quantity });
    return cart;
  } catch (err) {
    console.error("Failed to update item in Medusa cart", err);
    throw err;
  }
}

export function persistCartId(cartId: string | null) {
  if (typeof window === 'undefined') return
  if (cartId) localStorage.setItem('cart_id', cartId)
  else localStorage.removeItem('cart_id')
}
