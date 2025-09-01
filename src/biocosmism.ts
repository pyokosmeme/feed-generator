export type Tenet = 'liveForever' | 'goAnywhere' | 'becomeAnything' | 'ifYouWantTo'

// Seed terms that identify posts about Biocosmism in general
export const SEED_TERMS: string[] = [
  'biocosmism',
  'biocosmist',
  'biocosmic',
  'immortalism',
  'interplanetarianism',
  'morphological freedom',
  'longevity',
  'anti-aging',
  'space colonization',
]

// Keywords that map to the 3½ Tenets of Biocosmism
export const TENET_KEYWORDS: Record<Tenet, string[]> = {
  liveForever: [
    'live forever',
    'immortality',
    'longevity',
    'anti-aging',
    'life extension',
    'cryonics',
    'resurrection',
  ],
  goAnywhere: [
    'space travel',
    'spaceflight',
    'rocket',
    'mars',
    'moon',
    'cosmic',
    'astronaut',
    'colonization',
  ],
  becomeAnything: [
    'morphological freedom',
    'body modification',
    'cyborg',
    'transhuman',
    'self-directed evolution',
    'genetic engineering',
  ],
  ifYouWantTo: [
    'voluntary',
    'choice',
    'consent',
  ],
}
