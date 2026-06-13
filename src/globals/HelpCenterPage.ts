import type { GlobalConfig } from 'payload'

export const HelpCenterPage: GlobalConfig = {
  slug: 'help-center-page',
  label: 'Help Center Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Welcome! How can we help?',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Search in our help center for quick answers',
      required: true,
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      defaultValue: 'Search for questions or topics...',
      required: true,
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Help Categories',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon Name (e.g. HelpCircle, Settings, Users, Wallet)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
