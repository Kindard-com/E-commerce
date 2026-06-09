'use client'

import React, { useState } from 'react'

export const TicketFormClient: React.FC<{
  successMessage?: string | null
  nameLabel?: string | null
  namePlaceholder?: string | null
  emailLabel?: string | null
  emailPlaceholder?: string | null
  subjectLabel?: string | null
  subjectPlaceholder?: string | null
  messageLabel?: string | null
  messagePlaceholder?: string | null
  submitButtonText?: string | null
}> = ({
  successMessage,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  subjectLabel,
  subjectPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
}) => {
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

  return (
    <>
      <style>{`
        .tf-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto 100px;
          padding: 0 20px;
        }
        .tf-container {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .tf-success-box {
          text-align: center;
          padding: 60px 20px;
        }
        .tf-success-icon {
          width: 80px;
          height: 80px;
          background: #edf2ff;
          color: #3252df;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .tf-success-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 12px;
        }
        .tf-success-desc {
          font-size: 16px;
          color: #718096;
        }
        .tf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 600px) {
          .tf-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        .tf-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        .tf-label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
        }
        .tf-input, .tf-textarea {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          padding: 14px 16px;
          font-size: 16px;
          color: #1a202c;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tf-input:focus, .tf-textarea:focus {
          border-color: #3252df;
          box-shadow: 0 0 0 3px rgba(50, 82, 223, 0.1);
        }
        .tf-input::placeholder, .tf-textarea::placeholder {
          color: #a0aec0;
        }
        .tf-textarea {
          resize: vertical;
          min-height: 120px;
        }
        .tf-error {
          background: #fff5f5;
          color: #e53e3e;
          padding: 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          border: 1px solid #fed7d7;
        }
        .tf-submit {
          width: 100%;
          background: #3252df;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          padding: 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .tf-submit:hover:not(:disabled) {
          background: #2841b3;
        }
        .tf-submit:active:not(:disabled) {
          transform: scale(0.98);
        }
        .tf-submit:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }
        .tf-spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {status === 'success' ? (
        <div className="tf-success-box">
          <div className="tf-success-icon">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="tf-success-title">Thank You!</h3>
          <p className="tf-success-desc">{successMessage || 'Your ticket has been submitted successfully.'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="tf-grid">
            <div className="tf-field" style={{ marginBottom: 0 }}>
              <label htmlFor="customerName" className="tf-label">{nameLabel || 'Name'}</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                placeholder={namePlaceholder || 'John Doe'}
                className="tf-input"
                disabled={status === 'loading'}
              />
            </div>
            <div className="tf-field" style={{ marginBottom: 0 }}>
              <label htmlFor="customerEmail" className="tf-label">{emailLabel || 'Email Address'}</label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                placeholder={emailPlaceholder || 'john@example.com'}
                className="tf-input"
                disabled={status === 'loading'}
              />
            </div>
          </div>

          <div className="tf-field">
            <label htmlFor="subject" className="tf-label">{subjectLabel || 'Subject'}</label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder={subjectPlaceholder || 'What do you need help with?'}
              className="tf-input"
              disabled={status === 'loading'}
            />
          </div>

          <div className="tf-field">
            <label htmlFor="message" className="tf-label">{messageLabel || 'Message'}</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={messagePlaceholder || 'Please describe your issue in detail...'}
              className="tf-textarea"
              disabled={status === 'loading'}
            />
          </div>

          {status === 'error' && (
            <div className="tf-error">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="tf-submit"
          >
            {status === 'loading' ? (
              <>
                <svg className="tf-spinner" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              submitButtonText || 'Submit Ticket'
            )}
          </button>
        </form>
      )}
    </>
  )
}

