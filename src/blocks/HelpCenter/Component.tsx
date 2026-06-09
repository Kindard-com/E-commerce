import React from 'react'
import type { HelpCenterBlock as HelpCenterBlockType, HelpCenterCard } from '@/payload-types'
import { HelpCenterClient } from './ClientComponent'

export const HelpCenterBlock: React.FC<HelpCenterBlockType> = (props) => {
  const { heroTitle, heroSubtitle, searchPlaceholder, cards, heroImage } = props

  const mappedCards: HelpCenterCard[] = (cards || []).map((card) => ({
    id: card.id,
    iconName: card.icon,
    title: card.title,
    description: card.description,
    linkUrl: card.linkUrl || '#',
  }))

  const imageUrl = heroImage && typeof heroImage !== 'string' ? heroImage.url : null

  return (
    <HelpCenterClient
      title={heroTitle}
      subtitle={heroSubtitle}
      searchPlaceholder={searchPlaceholder}
      cards={mappedCards}
      heroImage={imageUrl}
    />
  )
}
