'use client'

import React, { useState } from 'react'
import { HelpCircle, Smartphone, Users, Wallet, FileText, Search } from 'lucide-react'
import type { HelpCenterBlock as HelpCenterBlockType } from '@/payload-types'

const iconMap = {
  'help-circle': HelpCircle,
  'smartphone-charging': Smartphone,
  'users': Users,
  'wallet': Wallet,
  'file-text': FileText,
}

export const HelpCenterClient: React.FC<HelpCenterBlockType> = (props) => {
  const { heroTitle, heroSubtitle, searchPlaceholder, cards } = props
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCards = (cards || []).filter((card) => {
    const query = searchQuery.toLowerCase()
    return (
      card.title.toLowerCase().includes(query) ||
      (card.description && card.description.toLowerCase().includes(query))
    )
  })

  // When a card is clicked, scroll down to the ticket form if it exists
  const handleCardClick = () => {
    const ticketForm = document.getElementById('ticket-form-section')
    if (ticketForm) {
      ticketForm.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If no ticket form on page, scroll to bottom as fallback
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full bg-slate-50 relative pb-24">
      {/* Blue Hero Section */}
      <div className="w-full bg-[#3b5bdb] pt-24 pb-48 px-6 relative overflow-hidden">
        {/* Subtle background pattern (cityscape abstraction) */}
        <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none flex justify-center items-end">
           <svg viewBox="0 0 1200 300" className="w-full min-w-[1200px]" preserveAspectRatio="xMidYMax meet">
              <path d="M0,300 L0,200 L50,200 L50,150 L100,150 L100,250 L150,250 L150,100 L200,100 L200,180 L250,180 L250,220 L300,220 L300,80 L350,80 L350,260 L400,260 L400,120 L450,120 L450,190 L500,190 L500,50 L550,50 L550,230 L600,230 L600,140 L650,140 L650,280 L700,280 L700,160 L750,160 L750,90 L800,90 L800,210 L850,210 L850,130 L900,130 L900,250 L950,250 L950,110 L1000,110 L1000,200 L1050,200 L1050,170 L1100,170 L1100,240 L1150,240 L1150,150 L1200,150 L1200,300 Z" fill="none" stroke="white" strokeWidth="2"/>
           </svg>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10">
            {heroSubtitle}
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-32 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg text-gray-800"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute inset-y-2 right-2 bg-[#3b5bdb] hover:bg-blue-700 text-white px-8 rounded-full font-semibold transition-colors duration-200">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-3xl mx-auto px-4 relative z-20 -mt-24 space-y-4">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, idx) => {
            const IconComponent = iconMap[card.icon as keyof typeof iconMap] || HelpCircle
            return (
              <div 
                key={card.id || idx}
                onClick={handleCardClick}
                className="bg-white rounded-2xl p-6 md:p-8 flex items-start gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#3b5bdb] group-hover:text-white text-[#3b5bdb] transition-colors duration-300">
                  <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#3b5bdb] mb-2">{card.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
