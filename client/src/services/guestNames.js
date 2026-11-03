/**
 * @file guestNames.js
 * @description Generates fun, cinema-themed random nicknames for friends
 * joining via an invite link.
 */

const ADJECTIVES = [
  'Chill',
  'Cosmic',
  'Golden',
  'Epic',
  'Cyber',
  'Velvet',
  'Neon',
  'Mystic',
  'Silver',
  'Starlight',
  'Retro',
  'Astral',
];

const NOUNS = [
  'Popcorn',
  'Viewer',
  'Cinephile',
  'Critic',
  'Director',
  'Watcher',
  'Spectator',
  'Reel',
  'Pixel',
  'Nomad',
  'Spark',
  'Captain',
];

export function generateRandomGuestName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90); // 2-digit number (10-99)
  return `${adj}${noun}${num}`;
}
