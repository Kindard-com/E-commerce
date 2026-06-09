import React from 'react'
import { TicketFormClient } from './ClientComponent'
import type { TicketFormBlock as TicketFormBlockProps } from '@/payload-types'

export const TicketFormBlock: React.FC<TicketFormBlockProps> = (props) => {
  return (
    <div className="tf-wrapper" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1a202c', marginBottom: '12px' }}>
          {props.heading || 'Submit a Support Ticket'}
        </h2>
        {props.description && (
          <p style={{ fontSize: '18px', color: '#718096' }}>
            {props.description}
          </p>
        )}
      </div>
      
      <div className="tf-container">
        <TicketFormClient 
          successMessage={props.successMessage}
          nameLabel={props.nameLabel}
          namePlaceholder={props.namePlaceholder}
          emailLabel={props.emailLabel}
          emailPlaceholder={props.emailPlaceholder}
          subjectLabel={props.subjectLabel}
          subjectPlaceholder={props.subjectPlaceholder}
          messageLabel={props.messageLabel}
          messagePlaceholder={props.messagePlaceholder}
          submitButtonText={props.submitButtonText}
        />
      </div>
    </div>
  )
}
