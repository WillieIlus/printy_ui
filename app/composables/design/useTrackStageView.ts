import type { DesignStageView } from '~/components/design/tracker/StageTimeline.vue'

export type TrackStageInput = {
  key: string
  label: string
  state: string
  is_overdue?: boolean | null
}

/**
 * Adapts Printy's public tracker timeline lines (JobStageTimelineLine) to the
 * presentational DesignStageTimeline shape. The store and API client are not
 * touched: TrackView still owns every fetch and every timing value.
 */
export function useTrackStageView() {
  function toDesignStages<T extends TrackStageInput>(
    lines: T[],
    labelFor?: (line: T) => { leftLabel?: string },
  ): DesignStageView[] {
    return lines.map((line, index) => ({
      key: line.key,
      index,
      label: line.label,
      state: line.state === 'completed'
        ? 'done'
        : line.state === 'current' || line.state === 'overdue' || line.is_overdue
          ? 'active'
          : 'upcoming',
      leftLabel: labelFor?.(line).leftLabel,
    }))
  }

  return { toDesignStages }
}
