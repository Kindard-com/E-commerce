'use client'

import React from 'react'

export const MarqueeClient: React.FC<{
  text: string
  backgroundColor: string
  textColor: string
}> = ({ text, backgroundColor, textColor }) => {
  return (
    <>
      <style>{`
        .marquee-wrapper {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          padding: 12px 0;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eaeaea;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 25s linear infinite;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .marquee-content span {
          margin-right: 48px;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="marquee-wrapper" style={{ backgroundColor, color: textColor }}>
        <div className="marquee-content">
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </>
  )
}
