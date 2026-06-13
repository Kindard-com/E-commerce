import type { Block } from 'payload'

export const SizeGuide: Block = {
  slug: 'sizeGuide',
  interfaceName: 'SizeGuideBlock',
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Size Guide',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Find your perfect fit. Our sizes run true to fit, but if you prefer an oversized look, we recommend sizing up.',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'sizeName',
          type: 'text',
          required: true,
          label: 'Size Name (e.g. XS, S, M)',
        },
        {
          name: 'measurements',
          type: 'text',
          label: 'Measurements (e.g. Chest: 38", Length: 27")',
        },
        {
          name: 'fitType',
          type: 'select',
          options: [
            { label: 'Tight', value: 'tight' },
            { label: 'Regular', value: 'regular' },
            { label: 'Oversized', value: 'oversized' },
          ],
          defaultValue: 'regular',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description / Advice',
        },
      ],
    },
  ],
}
