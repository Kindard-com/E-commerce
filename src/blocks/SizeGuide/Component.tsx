import React from 'react'
import type { SizeGuideBlock as SizeGuideBlockType } from '@/payload-types'

export const SizeGuideBlock: React.FC<SizeGuideBlockType> = (props) => {
  const { headline, description, cards } = props

  return (
    <div className="size-guide-wrapper" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        {headline && (
          <h2 style={{ 
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontSize: '48px', 
            textTransform: 'uppercase', 
            marginBottom: '16px',
            fontWeight: 900
          }}>
            {headline}
          </h2>
        )}
        {description && (
          <p style={{ fontSize: '18px', color: 'var(--mid)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {cards?.map((card, index) => (
          <div key={index} style={{
            border: '2px solid var(--border)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'var(--white)',
            color: 'var(--black)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid var(--black)',
              paddingBottom: '12px'
            }}>
              <span style={{ 
                fontFamily: "'Barlow Condensed', sans-serif", 
                fontSize: '36px', 
                fontWeight: 900 
              }}>
                {card.sizeName}
              </span>
              <span style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                fontWeight: 600,
                padding: '4px 8px',
                backgroundColor: 'var(--black)',
                color: 'var(--white)'
              }}>
                {card.fitType} Fit
              </span>
            </div>
            
            {card.measurements && (
              <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '.05em' }}>
                MEASUREMENTS: <span style={{ color: 'var(--mid)' }}>{card.measurements}</span>
              </div>
            )}
            
            {card.description && (
              <p style={{ fontSize: '14px', color: 'var(--mid)', lineHeight: 1.5, margin: 0 }}>
                {card.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
