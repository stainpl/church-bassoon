// src/types/admin.ts

/**
 * All valid dashboard section keys.
 */
export type SectionKey =
  | 'Blogs'
  | 'Members'
  | 'Payments'
  | 'Notice'
  | 'Admins'
  | 'Photos'
  | 'Videos'
  | 'Newsletter'

/**
 * Array of all section keys (for menus, mapping, etc).
 */
export const SECTION_KEYS: SectionKey[] = [
  'Blogs',
  'Members',
  'Payments',
  'Notice',
  'Admins',
  'Photos',
  'Videos',
  'Newsletter',
]
