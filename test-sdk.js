import Medusa from '@medusajs/js-sdk'
const sdk = new Medusa({ baseUrl: "http://127.0.0.1:9000" })
console.log(Object.keys(sdk))
console.log(Object.keys(sdk.store))
