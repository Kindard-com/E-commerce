import { createLocalReq, getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'
import { seed } from '@/endpoints/seed'
import { seedPayloadCatalog } from '@/scripts/seed-payload-catalog'

export const maxDuration = 120

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await getHeaders()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payloadReq = await createLocalReq({ user }, payload)
    payload.logger.info({ msg: 'Seeding Payload database', user: user.email, req: payloadReq.id })
    await seed({ payload, req: payloadReq })
    const catalog = await seedPayloadCatalog()
    return Response.json({ success: true, ...catalog })
  } catch (error) {
    payload.logger.error({ err: error, message: 'Error seeding' })
    return Response.json({ error: 'Error seeding.' }, { status: 500 })
  }
}
