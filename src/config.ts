// Game configuration constants
export const MAX_DISK = 6
export const MAX_MOVES = 2 ** MAX_DISK - 1 // 2^n - 1 for n disks

// Messages
export const SUMMARY_MESSAGE = `Too many moves to list or auto-solve. Reduce n to ${MAX_DISK} or less.`
