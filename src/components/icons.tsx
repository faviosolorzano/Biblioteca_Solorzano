import type { CSSProperties } from 'react'

const paths = {
  book: 'M4 3h6a3 3 0 0 1 3 3v15a4 4 0 0 0-4-3H3V4a1 1 0 0 1 1-1Zm16 0h-4a3 3 0 0 0-3 3v15a4 4 0 0 1 4-3h4V4a1 1 0 0 0-1-1Z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  plus: 'M12 5v14M5 12h14',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  edit: 'm16 3 5 5L8 21H3v-5L16 3ZM14 5l5 5',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  close: 'm6 6 12 12M6 18 18 6',
  back: 'M19 12H5m6-6-6 6 6 6',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c4 5 4 13 0 18-4-5-4-13 0-18Z',
  pages: 'M6 3h9l4 4v14H6V3ZM14 3v5h5M9 12h7M9 16h7',
  filter: 'M4 7h16M7 12h10M10 17h4',
  check: 'm5 12 4 4L19 6',
} satisfies Record<string, string>

export function Icon({ name, size = 20, style }: { name: keyof typeof paths; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
