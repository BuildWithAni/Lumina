const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Encode a numeric product ID into a 6-character alphanumeric display ID */
export function encodeProductId(id: number): string {
  // Spread IDs across the full 6-char space and scramble ordering
  let num = id * 7919 + 33554432;
  let result = '';
  for (let i = 0; i < 6; i++) {
    result = CHARS[num % 32] + result;
    num = Math.floor(num / 32);
  }
  return result;
}

/** Decode a 6-character display ID back to the original numeric product ID */
export function decodeProductId(code: string): number | null {
  if (code.length !== 6) return null;
  let num = 0;
  for (const char of code) {
    const idx = CHARS.indexOf(char);
    if (idx === -1) return null;
    num = num * 32 + idx;
  }
  const id = (num - 33554432) / 7919;
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}
