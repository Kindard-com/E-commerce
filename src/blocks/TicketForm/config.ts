import type { Block } from 'payload'

export const TicketFormBlock: Block = {
  slug: 'ticketForm',
  labels: {
    singular: 'Contact Team',
    plural: 'Contact Teams',
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
      name: 'nameLabel',
      type: 'text',
      defaultValue: 'Name',
      admin: { description: 'Label for the Name field' },
    },
    {
      name: 'namePlaceholder',
      type: 'text',
      defaultValue: 'John Doe',
    },
    {
      name: 'emailLabel',
      type: 'text',
      defaultValue: 'Email Address',
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      defaultValue: 'john@example.com',
    },
    {
      name: 'subjectLabel',
      type: 'text',
      defaultValue: 'Subject',
    },
    {
      name: 'subjectPlaceholder',
      type: 'text',
      defaultValue: 'What do you need help with?',
    },
    {
      name: 'messageLabel',
      type: 'text',
      defaultValue: 'Message',
    },
    {
      name: 'messagePlaceholder',
      type: 'textarea',
      defaultValue: 'Please describe your issue in detail...',
    },
    {
      name: 'submitButtonText',
      type: 'text',
      defaultValue: 'Submit Ticket',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Your ticket has been submitted successfully!',
    },
  ],
}
