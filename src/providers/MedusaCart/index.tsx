'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Medusa from '@medusajs/js-sdk'

export const medusaClient = new Medusa({
  baseUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_URL ||
    'http://127.0.0.1:9000',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  maxRetries: 3,
})

// Define the shape that the Payload components expect
type PayloadCart = {
  items?: any[]
  subtotal?: number
}

type MedusaCartContextType = {
  cart: PayloadCart | null
  addItemToCart: (args: { product: any; variant?: any; quantity?: number }) => Promise<void>
  deleteItemFromCart: (item: any) => Promise<void>
  cartIsEmpty: boolean
  hasInitializedCart: boolean
}

const MedusaCartContext = createContext<MedusaCartContextType | undefined>(undefined)

export const MedusaCartProvider = ({ children }: { children: ReactNode }) => {
  const [medusaCart, setMedusaCart] = useState<any>(null)
  const [cart, setPayloadCart] = useState<PayloadCart | null>(null)
  const [hasInitializedCart, setHasInitializedCart] = useState(false)

  useEffect(() => {
    const setupCart = async () => {
      try {
        const { regions } = await medusaClient.store.region.list()
        if (regions && regions.length > 0) {
          const regionId = regions[0].id
          const cartId = localStorage.getItem('cart_id')
          if (cartId) {
            const { cart } = await medusaClient.store.cart.retrieve(cartId)
            setMedusaCart(cart)
          } else {
            const { cart } = await medusaClient.store.cart.create({ region_id: regionId })
            localStorage.setItem('cart_id', cart.id)
            setMedusaCart(cart)
          }
        }
      } catch (e) {
        console.error(e)
      }
      setHasInitializedCart(true)
    }

    setupCart()
  }, [])

  // Map Medusa Cart to Payload Cart whenever Medusa Cart changes
  useEffect(() => {
    if (!medusaCart) {
      setPayloadCart(null)
      return
    }

    const payloadItems = (medusaCart.items || []).map((item: any) => ({
      // Fake item ID needed for DeleteItemButton
      id: item.id,
      quantity: item.quantity,
      product: {
        slug: item.variant?.product?.handle || item.title?.toLowerCase().replace(/ /g, '-'),
        title: item.title,
        priceInUSD: item.unit_price / 100, // Medusa stores in cents
        meta: {
          image: {
            url: item.thumbnail,
            alt: item.title,
          },
        },
      },
      variant: item.variant ? {
        id: item.variant_id,
        priceInUSD: item.unit_price / 100,
        options: [{ label: item.variant.title, id: item.variant_id }]
      } : undefined,
    }))

    setPayloadCart({
      items: payloadItems,
      subtotal: medusaCart.subtotal ? medusaCart.subtotal / 100 : 0,
    })
  }, [medusaCart])

  const addItemToCart = async (args: { product: any; variant?: any; quantity?: number }) => {
    if (!medusaCart) return
    const variantId = args.variant?.id || args.product?.variant_id || args.variant // Adapt based on what Payload passes
    if (!variantId) {
      console.error("Medusa requires a variant ID to add to cart.")
      return
    }

    try {
      const { cart } = await medusaClient.store.cart.lineItem.create(medusaCart.id, {
        variant_id: variantId,
        quantity: args.quantity || 1,
      })
      setMedusaCart(cart)
    } catch (e) {
      console.error('Error adding to Medusa cart', e)
    }
  }

  const deleteItemFromCart = async (item: any) => {
    if (!medusaCart) return
    try {
      const { cart } = await medusaClient.store.cart.lineItem.delete(medusaCart.id, item.id)
      setMedusaCart(cart)
    } catch (e) {
      console.error('Error deleting item', e)
    }
  }

  return (
    <MedusaCartContext.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
        cartIsEmpty: !cart || !cart.items || cart.items.length === 0,
        hasInitializedCart,
      }}
    >
      {children}
    </MedusaCartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(MedusaCartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a MedusaCartProvider')
  }
  return context
}
