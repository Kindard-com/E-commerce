import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const SupportTickets: CollectionConfig = {
  slug: 'support-tickets',
  admin: {
    useAsTitle: 'ticketId',
    defaultColumns: ['ticketId', 'subject', 'status', 'customerEmail', 'createdAt'],
  },
  access: {
    // Anyone can create a ticket via the frontend form
    create: () => true,
    // Only admins can read/update/delete tickets in the dashboard
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'ticketId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' || !value) {
              const randomString = Math.random().toString(36).substring(2, 7).toUpperCase()
              return `TKT-${randomString}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Customer Request',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'customerName',
                  type: 'text',
                  required: true,
                  admin: { readOnly: true },
                },
                {
                  name: 'customerEmail',
                  type: 'email',
                  required: true,
                  admin: { readOnly: true },
                },
              ],
            },
            {
              name: 'subject',
              type: 'text',
              required: true,
              admin: { readOnly: true },
            },
            {
              name: 'message',
              type: 'textarea',
              required: true,
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Admin Reply',
          fields: [
            {
              name: 'draftReply',
              label: 'Draft Your Reply',
              type: 'textarea',
              admin: {
                description: 'Type your reply here. When you save this ticket, an email will be automatically sent to the customer.',
              },
            },
            {
              name: 'replyHistory',
              type: 'array',
              admin: {
                readOnly: true,
                description: 'History of replies sent to this customer.',
              },
              fields: [
                {
                  name: 'sentAt',
                  type: 'date',
                },
                {
                  name: 'message',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        // If an admin typed a reply and saved the document
        if (operation === 'update' && doc.draftReply && doc.draftReply !== previousDoc.draftReply) {
          try {
            // Send email to customer
            await req.payload.sendEmail({
              to: doc.customerEmail,
              from: `Kindard Support <support@kindard.com>`,
              subject: `Re: [${doc.ticketId}] ${doc.subject}`,
              html: `
                <div style="font-family: sans-serif; color: #1a1a1a;">
                  <p>Hi ${doc.customerName},</p>
                  <p>${doc.draftReply.replace(/\n/g, '<br>')}</p>
                  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                  <p style="color: #666; font-size: 12px;">Ticket ID: ${doc.ticketId}</p>
                  <p style="color: #666; font-size: 12px;">Original Message:<br>${doc.message}</p>
                </div>
              `,
            })

            // Update the document to clear the draft and append to history
            const newHistory = [...(doc.replyHistory || [])]
            newHistory.push({
              sentAt: new Date().toISOString(),
              message: doc.draftReply,
            })

            await req.payload.update({
              collection: 'support-tickets',
              id: doc.id,
              data: {
                draftReply: null,
                replyHistory: newHistory,
                status: 'in_progress', // Auto update status
              },
              // Disable hooks to prevent infinite loops
              req: {
                ...req,
                disableHooks: true,
              } as any,
            })
          } catch (error) {
            console.error('Error sending support email:', error)
            req.payload.logger.error({ msg: 'Failed to send support email', error })
          }
        }
      },
    ],
  },
}
