import { describe, expect, it } from 'vitest'
import Medusa from '@medusajs/js-sdk'

describe('Medusa JS SDK', () => {
  it('exposes store and admin namespaces used by the Kindard apps', () => {
    const sdk = new Medusa({
      baseUrl: 'http://127.0.0.1:9000',
      publishableKey: 'pk_test_kindard',
      maxRetries: 0,
    })

    expect(sdk.store).toBeDefined()
    expect(sdk.store.product).toBeDefined()
    expect(sdk.store.cart).toBeDefined()
    expect(sdk.store.region).toBeDefined()
    expect(sdk.admin).toBeDefined()
    expect(sdk.admin.product).toBeDefined()
    expect(typeof sdk.store.product.list).toBe('function')
    expect(typeof sdk.store.cart.create).toBe('function')
  })
})
