import { StatsCard } from '@/pages/analytics/StatsCard'
import React from 'react'
import StatsCardDialog from './statsCardDialog'
import type { Variant } from '@/types'
import { Grid } from './GenralComponents'

export interface AnalyticsCardProps {
  statsTitle: string
  statsValue: string
  statsDescription: string
  Icon: React.ComponentType<any>
  variant: Variant
  statsCardDialogTitle: string
  statsCardDialogLabel: string
  statsCardDialogChildren: React.ReactNode
  childrenGrid?: 2 | 3 | 4
  onReset: () => void
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  statsTitle,
  statsValue,
  statsDescription,
  Icon,
  variant,
  statsCardDialogTitle,
  statsCardDialogLabel,
  statsCardDialogChildren,
  childrenGrid,
  onReset,
}) => {
  return (
    <StatsCard
      title={statsTitle}
      value={statsValue}
      description={statsDescription}
      icon={Icon}
      variant={variant}
    >
      <StatsCardDialog
      onReset={onReset}
        title={statsCardDialogTitle}
        label={statsCardDialogLabel}
      >
        <Grid columns={childrenGrid || 2}>
          {statsCardDialogChildren}
        </Grid>
      </StatsCardDialog>
    </StatsCard>
  )
}

export default AnalyticsCard
