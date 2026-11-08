import { h } from 'vue'
import type { FunctionalComponent } from 'vue'

/**
 * Six Lucide glyphs changed between the source's lucide-react@1.69.0 and
 * lucide-vue-next@1.0.0. The node data below is taken from the source package
 * (ISC licence) so the migrated UI renders the exact same paths.
 */
export type SourceIconNode = [tag: string, attrs: Record<string, string>]

export interface SourceIconProps {
  size?: number | string
  color?: string
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
}

const defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/** Mirror lucide-vue-next's SVG contract for the locally preserved glyphs. */
export function createSourceIcon(
  name: string,
  iconNode: SourceIconNode[],
): FunctionalComponent<SourceIconProps> {
  const component: FunctionalComponent<SourceIconProps> = (props, { attrs, slots }) => {
    const size = props.size ?? 24
    const color = props.color ?? 'currentColor'
    const attrStrokeWidth = attrs['stroke-width']
    const strokeWidth = props.strokeWidth
      ?? (typeof attrStrokeWidth === 'string' || typeof attrStrokeWidth === 'number'
        ? attrStrokeWidth
        : 2)
    const absolute = props.absoluteStrokeWidth
      ?? (attrs['absolute-stroke-width'] === ''
        || attrs['absolute-stroke-width'] === true
        || attrs['absolute-stroke-width'] === 'true')
    const kebab = toKebabCase(name)
    const svgAttrs = Object.fromEntries(
      Object.entries(attrs).filter(
        ([key]) => !['class', 'absolute-stroke-width', 'stroke-width'].includes(key),
      ),
    )
    const hasA11yProp = Boolean(attrs['aria-label'] || attrs['aria-labelledby'] || attrs.role)

    return h(
      'svg',
      {
        ...defaultAttributes,
        ...svgAttrs,
        width: size,
        height: size,
        stroke: color,
        'stroke-width': absolute ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
        class: ['lucide', `lucide-${kebab}-icon`, `lucide-${kebab}`, attrs.class],
        ...(!slots.default && !hasA11yProp ? { 'aria-hidden': 'true' } : {}),
      },
      [
        ...iconNode.map(([tag, nodeAttrs]) => h(tag, nodeAttrs)),
        ...(slots.default ? [slots.default()] : []),
      ],
    )
  }

  component.displayName = name
  component.props = ['size', 'color', 'strokeWidth', 'absoluteStrokeWidth']
  component.inheritAttrs = false
  return component
}

const badgeCheck: SourceIconNode[] = [
  ['path', { d: 'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z' }],
  ['path', { d: 'm16 9-5.5 5.5L8 12' }],
]

const bookOpenText: SourceIconNode[] = [
  ['path', { d: 'M12 5v16' }],
  ['path', { d: 'M16 13h2' }],
  ['path', { d: 'M16 9h2' }],
  ['path', { d: 'M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z' }],
  ['path', { d: 'M6 13h2' }],
  ['path', { d: 'M6 9h2' }],
]

const calendarClock: SourceIconNode[] = [
  ['path', { d: 'M16 14v2.2l1.6 1' }],
  ['path', { d: 'M16 2v3' }],
  ['path', { d: 'M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338' }],
  ['path', { d: 'M3 9h5.859' }],
  ['path', { d: 'M8 2v3' }],
  ['circle', { cx: '16', cy: '16', r: '6' }],
]

const checkCircle2: SourceIconNode[] = [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'm16 9-5.5 5.5L8 12' }],
]

const circleDot: SourceIconNode[] = [
  ['circle', { cx: '12', cy: '12', r: '1' }],
  ['circle', { cx: '12', cy: '12', r: '10' }],
]

const landmark: SourceIconNode[] = [
  ['path', { d: 'M10 18v-7' }],
  ['path', { d: 'M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z' }],
  ['path', { d: 'M14 18v-7' }],
  ['path', { d: 'M18 18v-7' }],
  ['path', { d: 'M3 22h18' }],
  ['path', { d: 'M6 18v-7' }],
]

export const sourceIconOverrides = {
  BadgeCheck: createSourceIcon('BadgeCheck', badgeCheck),
  BookOpenText: createSourceIcon('BookOpenText', bookOpenText),
  CalendarClock: createSourceIcon('CalendarClock', calendarClock),
  CheckCircle2: createSourceIcon('CheckCircle2', checkCircle2),
  CircleDot: createSourceIcon('CircleDot', circleDot),
  Landmark: createSourceIcon('Landmark', landmark),
}
