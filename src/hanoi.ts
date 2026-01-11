import { Rods, RodName, Move } from "./types";

const ROD_NAMES: RodName[] = ["A", "B", "C"];

/**
 * Validates that the state contains exactly disks 1..n,
 * and each rod is strictly increasing (smallest on top).
 */
export function validateState(state: Rods, n: number): boolean {
  // Check that A, B, C exist and are arrays
  if (!state.A || !state.B || !state.C) return false;
  if (!Array.isArray(state.A) || !Array.isArray(state.B) || !Array.isArray(state.C)) return false;

  // Collect all disks
  const allDisks = [...state.A, ...state.B, ...state.C];

  // Must have exactly n disks
  if (allDisks.length !== n) return false;

  // Must contain exactly 1..n
  const sorted = [...allDisks].sort((a, b) => a - b);
  for (let i = 0; i < n; i++) {
    if (sorted[i] !== i + 1) return false;
  }

  // Each rod must be strictly increasing (index 0 is top, smallest)
  for (const rodName of ROD_NAMES) {
    const rod = state[rodName];
    for (let i = 0; i < rod.length - 1; i++) {
      if (rod[i] >= rod[i + 1]) return false;
    }
  }

  return true;
}

/**
 * Find which rod a disk is on
 */
function findDisk(state: Rods, disk: number): RodName {
  for (const rodName of ROD_NAMES) {
    if (state[rodName].includes(disk)) {
      return rodName;
    }
  }
  throw new Error(`Disk ${disk} not found`);
}

/**
 * Get the spare rod (the one that's neither 'a' nor 'b')
 */
function getSpareRod(a: RodName, b: RodName): RodName {
  for (const rod of ROD_NAMES) {
    if (rod !== a && rod !== b) return rod;
  }
  throw new Error("No spare rod found");
}

/**
 * Execute a move: shift from one rod, unshift to another
 */
function executeMoveOnState(state: Rods, from: RodName, to: RodName): number {
  const disk = state[from].shift();
  if (disk === undefined) throw new Error(`No disk to move from ${from}`);
  state[to].unshift(disk);
  return disk;
}

/**
 * Recursively solve Tower of Hanoi from any valid intermediate state.
 * Moves disks 1..k to the target rod.
 */
function solveRecursive(
  state: Rods,
  k: number,
  target: RodName,
  moves: Move[],
  stepCounter: { value: number }
): void {
  if (k === 0) return;

  const diskLocation = findDisk(state, k);

  if (diskLocation === target) {
    // Disk k is already on target, solve for smaller disks
    solveRecursive(state, k - 1, target, moves, stepCounter);
  } else {
    // Need to move disk k to target
    // First, move all smaller disks to the spare rod
    const spare = getSpareRod(diskLocation, target);
    solveRecursive(state, k - 1, spare, moves, stepCounter);

    // Move disk k to target
    const disk = executeMoveOnState(state, diskLocation, target);
    stepCounter.value++;
    moves.push({
      step: stepCounter.value,
      disk,
      from: diskLocation,
      to: target,
    });

    // Move all smaller disks from spare to target
    solveRecursive(state, k - 1, target, moves, stepCounter);
  }
}

/**
 * Solve Tower of Hanoi from the given state to have all disks on the target rod.
 * Returns the list of moves.
 */
export function solve(state: Rods, n: number, target: RodName): Move[] {
  // Deep clone the state so we can mutate it
  const workingState: Rods = {
    A: [...state.A],
    B: [...state.B],
    C: [...state.C],
  };

  const moves: Move[] = [];
  const stepCounter = { value: 0 };

  solveRecursive(workingState, n, target, moves, stepCounter);

  return moves;
}

/**
 * Calculate total moves needed: 2^n - 1
 */
export function calculateMoveCount(n: number): bigint {
  return BigInt(2) ** BigInt(n) - BigInt(1);
}
