import { medusaClient, SALES_CHANNEL_ID } from './medusa';
import { Product } from './products';

// Medusa API abstraction
export async function initMedusaCart(forceNew = false) {
  let cartId = typeof window !== 'undefined' && !forceNew ? localStorage.getItem('cart_id') : null;

  try {
    if (cartId) {
      const { cart } = await medusaClient.store.cart.retrieve(cartId, { fields: "*line_items,*line_items.variant,*line_items.variant.product" });
      return cart;
    }
  } catch (err) {
    console.error("Failed to retrieve existing cart, creating new one", err);
    if (typeof window !== 'undefined') localStorage.removeItem('cart_id');
  }

  try {
    const { cart } = await medusaClient.store.cart.create({
      sales_channel_id: SALES_CHANNEL_ID
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
  try {
    const { cart } = await medusaClient.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return cart;
  } catch (err) {
    console.error("Failed to add item to Medusa cart, attempting to recreate cart", err);
    
    // If the cart is stale or missing a sales channel, creating a new cart fixes it
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
  try {
    const { cart } = await medusaClient.store.cart.deleteLineItem(cartId, lineItemId);
    return cart;
  } catch (err) {
    console.error("Failed to remove item from Medusa cart", err);
    throw err;
  }
}

export async function updateLineItemInMedusa(cartId: string, lineItemId: string, quantity: number) {
  try {
    const { cart } = await medusaClient.store.cart.updateLineItem(cartId, lineItemId, { quantity });
    return cart;
  } catch (err) {
    console.error("Failed to update item in Medusa cart", err);
    throw err;
  }
}

