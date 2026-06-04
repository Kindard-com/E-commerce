import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: () => true, // Anyone can read this data on the frontend
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Play\nIn\nStyle',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Premium kidswear. Unmatched comfort, playful energy. Made for the little ones who start trends.',
          required: true,
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Shop the drop',
          required: true,
        },
        {
          name: 'ctaUrl',
          type: 'text',
          defaultValue: '/new-arrivals',
          required: true,
        },
        {
          name: 'imageUrl',
          type: 'text',
          defaultValue: '/api/images?file=hero_kids_streetwear_1779803641942.png',
          required: true,
        },
      ],
    },
    {
      name: 'featuresSection',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Kids play hard.\nTheir clothes should work harder.',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Stop replacing cheap clothes that shrink, fade, and tear. Kindard Kids delivers premium, ultra-durable streetwear that looks incredible and survives the playground.',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Feature Cards',
          minRows: 1,
          fields: [
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
              name: 'imageUrl',
              type: 'text',
              label: 'Image URL (from CDN)',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'faqSection',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Questions?',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Everything you need to know about shopping with Kindard Kids.',
        },
        {
          name: 'faqs',
          type: 'array',
          label: 'FAQs',
          minRows: 1,
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Ready to upgrade their wardrobe?',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Join thousands of parents styling the next generation of trendsetters.',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'SHOP NEW ARRIVALS',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          defaultValue: '/new-arrivals',
        },
      ],
    },
  ],
}
