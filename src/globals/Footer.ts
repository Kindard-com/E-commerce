import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
    {
      name: 'appStoreUrl',
      type: 'text',
      defaultValue: 'https://apps.apple.com/',
      required: true,
    },
    {
      name: 'googlePlayUrl',
      type: 'text',
      defaultValue: 'https://play.google.com/',
      required: true,
    },
  ],
}
