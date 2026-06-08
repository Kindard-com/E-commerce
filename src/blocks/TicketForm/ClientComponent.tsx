'use client'

import React, { useState } from 'react'

export const TicketFormClient: React.FC<{ successMessage?: string }> = ({ successMessage }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit ticket. Please try again.')
      }

      setStatus('success')
    } catch (err: any) {
      console.error('Ticket submission error:', err)
      setStatus('error')
      setErrorMessage(err.message || 'An unexpected error occurred.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
        <p className="text-gray-400">{successMessage || 'Your ticket has been submitted successfully.'}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            placeholder="John Doe"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            disabled={status === 'loading'}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300">Email Address</label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            required
            placeholder="john@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="What do you need help with?"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          disabled={status === 'loading'}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Please describe your issue in detail..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-y"
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 uppercase tracking-wide"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Submit Ticket'
        )}
      </button>
    </form>
  )
}
