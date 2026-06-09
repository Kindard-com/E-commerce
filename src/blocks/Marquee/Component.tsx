import React from 'react'
import type { MarqueeBlock as MarqueeBlockType } from '@/payload-types'
import { MarqueeClient } from './ClientComponent'

export const MarqueeBlock: React.FC<MarqueeBlockType> = (props) => {
  const { text, backgroundColor, textColor } = props
  
  return (
    <MarqueeClient 
      text={text || ''} 
      backgroundColor={backgroundColor || '#FFFFFF'} 
      textColor={textColor || '#000000'} 
    />
  )
}
