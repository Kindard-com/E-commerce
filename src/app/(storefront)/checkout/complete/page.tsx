"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { medusaClient } from '@/storefront/lib/medusa'
import { applyCustomerToken, persistCartId } from '@/storefront/lib/cart'
import { useStore } from '@/storefront/lib/StoreContext'

export default function CheckoutCompletePage() {
  const { clearCart } = useStore()
  const [status, setStatus] = useState<'loading' | 'order' | 'error'>('loading')
  const [message, setMessage] = useState('Finishing your order...')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const complete = async () => {
      applyCustomerToken()
      const params = new URLSearchParams(window.location.search)
      const cartId = params.get('cart_id') || localStorage.getItem('cart_id')
      if (!cartId) {
        setStatus('error')
        setMessage('No cart was found to complete.')
        return
      }

      try {
        const result = await medusaClient.store.cart.complete(cartId)
        if (result.type === 'order') {
          setOrderId(result.order?.id || String(result.order?.display_id || ''))
          persistCartId(null)
          clearCart()
          setStatus('order')
          setMessage('Payment received. Your order is in Medusa.')
          return
        }
        setStatus('error')
        setMessage('The cart still needs another payment action. Return to checkout.')
      } catch (error: any) {
        setStatus('error')
        setMessage(error?.message || 'Could not complete the order.')
      }
    }

    complete()
  }, [])

  return (
    <div style={{ padding: '100px 24px', maxWidth: '720px', margin: '0 auto', textAlign: 'center', minHeight: '500px' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '16px' }}>
        {status === 'order' ? 'Order confirmed' : status === 'error' ? 'Checkout needs attention' : 'Completing order'}
      </h1>
      <p style={{ color: 'var(--mid)', marginBottom: '24px' }}>{message}</p>
      {orderId && <p style={{ marginBottom: '24px', fontWeight: 600 }}>Order {orderId}</p>}
      <Link href={status === 'order' ? '/portal/orders' : '/checkout'} className="btn-primary" style={{ padding: '16px 32px' }}>
        {status === 'order' ? 'View orders' : 'Return to checkout'}
      </Link>
    </div>
  )
}
