import type { Block } from 'payload'

export const HelpCenterBlock: Block = {
  slug: 'helpCenter',
  interfaceName: 'HelpCenterBlock',
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      defaultValue: 'Welcome! How can we help?',
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      required: true,
      defaultValue: 'Search in our help center for quick answers',
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      required: true,
      defaultValue: 'Search for questions or topics...',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background photo for the hero area',
      },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      defaultValue: [
        {
          icon: 'help-circle',
          title: 'Frequently Asked Questions',
          description: 'Find answers to common questions about shopping with Kindard Kids, sizing, and our materials.',
        },
        {
          icon: 'smartphone-charging',
          title: 'Features and Functionalities',
          description: 'Learn about our premium fabric technology, durability features, and care instructions.',
        },
        {
          icon: 'users',
          title: 'Users and Accounts',
          description: 'Manage your Kindard Kids account, order history, and saved items.',
        },
        {
          icon: 'wallet',
          title: 'Billing and Payments',
          description: 'Information about accepted payment methods, secure checkout, and billing inquiries.',
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'help-circle',
          options: [
            { label: 'Question Mark (FAQ)', value: 'help-circle' },
            { label: 'Features (Phone/Gear)', value: 'smartphone-charging' },
            { label: 'Users (Group)', value: 'users' },
            { label: 'Billing (Wallet)', value: 'wallet' },
            { label: 'Ticket (Form)', value: 'file-text' },
          ],
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
        {
          name: 'linkUrl',
          type: 'text',
          admin: {
            description: 'Optional link URL for the card',
          },
        },
      ],
    },
  ],
}
