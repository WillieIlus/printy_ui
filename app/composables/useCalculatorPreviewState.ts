import { unref } from 'vue'
import type { ComputedRef, MaybeRef } from 'vue'
import type { PreviewPriceResponse } from '~/shared/types/buyer'

interface RequirementOptions {
  workspaceMode: MaybeRef<'catalog' | 'custom'>
  hasProduct: MaybeRef<boolean> | ComputedRef<boolean>
  customProductTitle: MaybeRef<string>
  customProductSpec: MaybeRef<string>
  quantity: MaybeRef<number | null>
  widthMm: MaybeRef<number | null>
  heightMm: MaybeRef<number | null>
  paperId: MaybeRef<number | null>
  sides: MaybeRef<'SIMPLEX' | 'DUPLEX'>
  colorMode: MaybeRef<'BW' | 'COLOR'>
  machineId: MaybeRef<number | null>
  turnaroundHours: MaybeRef<number | null>
  preview: MaybeRef<PreviewPriceResponse | null>
}

function hasPositiveNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function useCalculatorPreviewState(options: RequirementOptions) {
  const missingRequirements = computed(() => {
    const items: string[] = []
    const workspaceMode = unref(options.workspaceMode)
    const hasProduct = unref(options.hasProduct)
    const customProductTitle = unref(options.customProductTitle) ?? ''
    const customProductSpec = unref(options.customProductSpec) ?? ''
    const quantity = unref(options.quantity)
    const widthMm = unref(options.widthMm)
    const heightMm = unref(options.heightMm)
    const paperId = unref(options.paperId)
    const sides = unref(options.sides)
    const colorMode = unref(options.colorMode)
    const machineId = unref(options.machineId)
    const turnaroundHours = unref(options.turnaroundHours)
    const preview = unref(options.preview)

    if (workspaceMode === 'catalog') {
      if (!hasProduct) items.push('Select a catalog product')
    } else {
      if (!customProductTitle.trim()) items.push('Add a custom product title')
      if (!customProductSpec.trim()) items.push('Add a custom brief')
      if (!hasPositiveNumber(widthMm) || !hasPositiveNumber(heightMm)) {
        items.push('Enter the finished size')
      }
    }

    if (!hasPositiveNumber(quantity)) items.push('Enter the quantity')
    if (!paperId) items.push('Choose paper / GSM')
    if (!sides) items.push('Choose print sides')
    if (!colorMode) items.push('Choose colour mode')
    if (!machineId) items.push('Choose a machine or pricing basis')
    if (!hasPositiveNumber(turnaroundHours)) items.push('Set turnaround')

    const previewSuggestions = (preview?.suggestions?.map(item => item.message).filter((item): item is string => Boolean(item)) ?? [])
    for (const suggestion of previewSuggestions) {
      if (!items.includes(suggestion)) items.push(suggestion)
    }

    return items
  })

  const canShowFinalPricing = computed(() =>
    Boolean(unref(options.preview)?.totals?.grand_total || unref(options.preview)?.total || unref(options.preview)?.can_calculate)
  )

  return {
    missingRequirements,
    canShowFinalPricing,
  }
}
