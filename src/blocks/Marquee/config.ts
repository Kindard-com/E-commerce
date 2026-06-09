import type { Block } from 'payload'

export const Marquee: Block = {
  slug: 'marquee',
  interfaceName: 'MarqueeBlock',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      defaultValue: 'NEW ARRIVALS: MINI EXPLORER COLLECTION FREE SHIPPING OVER $150 PLAY IN STYLE MEMBERS GET EARLY ACCESS ',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      required: true,
      defaultValue: '#FFFFFF',
      admin: {
        description: 'Hex color code or valid CSS color (e.g. #FFFFFF or white)',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      required: true,
      defaultValue: '#000000',
      admin: {
        description: 'Hex color code or valid CSS color (e.g. #000000 or black)',
      },
    },
  ],
}
