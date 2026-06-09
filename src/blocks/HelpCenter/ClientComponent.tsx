'use client'

import React, { useState } from 'react'
import type { HelpCenterCard } from './Component'

// Inline SVGs for icons
const IconHelp = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
)
const IconSmartphone = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/><path d="M12 22v-4"/></svg>
)
const IconUsers = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)
const IconWallet = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
)
const IconFileText = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
)
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
)

const iconMap: Record<string, React.FC> = {
  'help-circle': IconHelp,
  'smartphone-charging': IconSmartphone,
  'users': IconUsers,
  'wallet': IconWallet,
  'file-text': IconFileText,
}

export const HelpCenterClient: React.FC<{
  title?: string | null
  subtitle?: string | null
  searchPlaceholder?: string | null
  heroImage?: string | null
  cards: HelpCenterCard[]
}> = ({ title, subtitle, searchPlaceholder, heroImage, cards }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCards = (cards || []).filter((card) => {
    const query = searchQuery.toLowerCase()
    return (
      card.title.toLowerCase().includes(query) ||
      (card.description && card.description.toLowerCase().includes(query))
    )
  })

  return (
    <>
      <style>{`
        .hc-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #fafafa;
          min-height: 100vh;
        }
        .hc-hero {
          background: #3252df;
          position: relative;
          padding: 80px 20px 140px;
          text-align: center;
          overflow: hidden;
        }
        .hc-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='800' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 300 L50 300 L50 250 L100 250 L100 150 L150 150 L150 280 L200 280 L200 180 L250 180 L250 220 L300 220 L300 100 L350 100 L350 260 L400 260 L400 130 L450 130 L450 200 L500 200 L500 80 L550 80 L550 240 L600 240 L600 170 L650 170 L650 290 L700 290 L700 210 L750 210 L750 300 L800 300' fill='none' stroke='%234b68e5' stroke-width='1.5' /%3E%3Cpath d='M20 280 L40 280 L40 200 L80 200 L80 120 L120 120 L120 240 L160 240 L160 160 L200 160 L200 260' fill='none' stroke='%234b68e5' stroke-width='1' opacity='0.5' /%3E%3C/svg%3E");
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          z-index: 0;
        }
        .hc-hero-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(50, 82, 223, 0.4);
        }
        .hc-content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
        }
        .hc-title {
          font-size: 40px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .hc-subtitle {
          font-size: 18px;
          color: #e2e8f0;
          margin-bottom: 32px;
          font-weight: 400;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .hc-search-wrapper {
          background: #ffffff;
          border-radius: 9999px;
          height: 64px;
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding: 8px 8px 8px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .hc-search-icon {
          margin-right: 12px;
          display: flex;
          align-items: center;
        }
        .hc-search-input {
          flex: 1;
          height: 100%;
          border: none;
          background: transparent;
          font-size: 16px;
          color: #4a5568;
          outline: none;
        }
        .hc-search-input::placeholder {
          color: #a0aec0;
        }
        .hc-search-btn {
          height: 100%;
          padding: 0 32px;
          background: #3252df;
          border: none;
          border-radius: 9999px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .hc-search-btn:hover {
          background: #2841b3;
        }
        .hc-cards-container {
          max-width: 800px;
          margin: -60px auto 60px;
          padding: 0 20px;
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .hc-card {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 32px;
          text-decoration: none;
          display: flex;
          align-items: flex-start;
          gap: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }
        .hc-card-icon-wrapper {
          width: 64px;
          height: 64px;
          background: #edf2ff;
          color: #3252df;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .hc-card-content {
          flex: 1;
        }
        .hc-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #3252df;
          margin-bottom: 8px;
          margin-top: 4px;
        }
        .hc-card-desc {
          font-size: 15px;
          color: #718096;
          line-height: 1.6;
        }
        .hc-no-results {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 16px;
          font-size: 20px;
          font-weight: 600;
          color: #718096;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        @media (max-width: 600px) {
          .hc-card {
            flex-direction: column;
            gap: 16px;
            padding: 24px;
          }
          .hc-title {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="hc-container">
        <div className="hc-hero">
          <div 
            className="hc-hero-bg" 
            style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
          />
          
          <div className="hc-content-wrapper">
            <h1 className="hc-title">
              {title || 'Welcome! How can we help?'}
            </h1>
            <p className="hc-subtitle">
              {subtitle || 'Search in our help center for quick answers'}
            </p>

            <div className="hc-search-wrapper">
              <div className="hc-search-icon">
                <IconSearch />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder || 'Search for questions or topics...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hc-search-input"
              />
              <button className="hc-search-btn">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="hc-cards-container">
          {filteredCards.length > 0 ? (
            filteredCards.map((card, idx) => {
              const IconComponent = iconMap[card.iconName] || IconHelp
              return (
                <a key={idx} href={card.linkUrl || '#'} className="hc-card">
                  <div className="hc-card-icon-wrapper">
                    <IconComponent />
                  </div>
                  <div className="hc-card-content">
                    <h3 className="hc-card-title">{card.title}</h3>
                    <p className="hc-card-desc">{card.description}</p>
                  </div>
                </a>
              )
            })
          ) : (
            <div className="hc-no-results">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </>
  )
}



