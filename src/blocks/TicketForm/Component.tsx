import React from 'react'
import { TicketFormClient } from './ClientComponent'

export type TicketFormBlockProps = {
  heading?: string
  description?: string
  successMessage?: string
}

export const TicketFormBlock: React.FC<TicketFormBlockProps> = (props) => {
  return (
    <div className="py-16 md:py-24 max-w-3xl mx-auto px-4 md:px-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4">{props.heading || 'Submit a Support Ticket'}</h2>
        {props.description && <p className="text-gray-500 text-lg">{props.description}</p>}
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
        <TicketFormClient successMessage={props.successMessage} />
      </div>
    </div>
  )
}
