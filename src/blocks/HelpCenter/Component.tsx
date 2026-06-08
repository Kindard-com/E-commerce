import React from 'react'
import type { HelpCenterBlock as HelpCenterBlockType } from '@/payload-types'
import { HelpCenterClient } from './ClientComponent'

export const HelpCenterBlock: React.FC<HelpCenterBlockType> = (props) => {
  return <HelpCenterClient {...props} />
}
