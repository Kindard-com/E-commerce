import type { Block } from 'payload'

export const TicketFormBlock: Block = {
  slug: 'ticketForm',
  labels: {
    singular: 'Support Ticket Form',
    plural: 'Support Ticket Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Submit a Support Ticket',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Please fill out the form below and our team will get back to you shortly.',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Your ticket has been submitted successfully!',
    },
  ],
}
