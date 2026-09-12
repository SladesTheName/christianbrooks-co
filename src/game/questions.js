export const QUESTION_PACKS = [
  {
    id: 'appearance',
    name: 'Appearance',
    emoji: '👓',
    premium: false,
    prompts: [
      'Is your person a man?',
      'Does your person wear glasses?',
      'Does your person have dark hair?',
      'Is your person taller than you?',
      'Does your person have facial hair?',
      'Is your person’s hair longer than shoulder length?',
      'Would you spot your person easily in a crowd?',
    ],
  },
  {
    id: 'life',
    name: 'Life',
    emoji: '🏡',
    premium: false,
    prompts: [
      'Is your person married?',
      'Does your person have children?',
      'Are they older than 40?',
      'Do they own a pet?',
      'Do they live nearby?',
      'Do they have a job you could explain in one sentence?',
      'Have they lived in the same place for more than five years?',
    ],
  },
  {
    id: 'relationship',
    name: 'Relationship',
    emoji: '🤝',
    premium: false,
    prompts: [
      'Have we been to their house?',
      'Have they been to our house?',
      'Have we traveled with them?',
      'Have we known them for more than five years?',
      'Have they met our children?',
      'Would they help us move?',
      'Do we see them at least once a month?',
    ],
  },
  {
    id: 'personality',
    name: 'Personality',
    emoji: '✨',
    premium: false,
    prompts: [
      'Would you describe them as outgoing?',
      'Are they competitive?',
      'Would they enjoy camping?',
      'Are they usually early?',
      'Would you call them a good cook?',
      'Are they the loudest person in most rooms?',
      'Do they tell long stories?',
    ],
  },
  {
    id: 'chaos',
    name: 'Chaos Mode',
    emoji: '🔥',
    premium: true,
    prompts: [
      'Would this person survive a zombie apocalypse?',
      'Would they send food back at a restaurant?',
      'Would they sing karaoke?',
      'Could they survive a week without their phone?',
      'Would they be useful during an emergency?',
      'Would they willingly sleep in a tent?',
      'Would they answer your call at 2 AM?',
      'Would they win an argument with a toddler?',
      'Would they read the instructions first?',
    ],
  },
]

export function shuffle(array) {
  const out = [...array]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
