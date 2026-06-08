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
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
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
      ],
    },
  ],
}
