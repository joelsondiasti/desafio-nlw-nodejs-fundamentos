import { init } from '@paralleldrive/cuid2';

export const createId = init({
  fingerprint: 'nodefundamentals',
  random: Math.random,
  length: 8,
});
