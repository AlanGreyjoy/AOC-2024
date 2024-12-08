import * as fs from 'fs'
import * as path from 'path'

type NumberSequence = number[]

/**
 * Validates if a numeric sequence follows safety rules without any modifications.
 * A sequence is considered safe if:
 * - Adjacent numbers differ by 1-3 units
 * - The sequence is consistently increasing or decreasing
 * @param sequence - Array of numbers to validate
 * @returns boolean indicating if sequence is safe without modifications
 */
const isSequenceStrictlySafe = (sequence: NumberSequence): boolean => {
  if (sequence.length < 2) return true

  const isIncreasing: boolean = sequence[1] > sequence[0]

  for (let i = 1; i < sequence.length; i++) {
    const diff: number = sequence[i] - sequence[i - 1]
    const absDiff: number = Math.abs(diff)

    if (absDiff < 1 || absDiff > 3) return false
    if (isIncreasing && diff <= 0) return false
    if (!isIncreasing && diff >= 0) return false
  }

  return true
}

/**
 * Determines if a sequence can be made safe by removing exactly one number.
 * Tests each possible removal to find a valid safe sequence.
 * @param sequence - Array of numbers to analyze
 * @returns boolean indicating if sequence can be made safe by removing one number
 */
const canBeMadeSafe = (sequence: NumberSequence): boolean => {
  // Try removing each number one at a time and check if the resulting sequence is safe
  for (let i = 0; i < sequence.length; i++) {
    const modifiedSequence = [...sequence.slice(0, i), ...sequence.slice(i + 1)]
    if (isSequenceStrictlySafe(modifiedSequence)) {
      return true
    }
  }
  return false
}

/**
 * Validates if a sequence is safe, either in its original form or by removing one number.
 * Uses the Problem Dampener rules which allow for one number removal.
 * @param sequence - Array of numbers to validate
 * @returns boolean indicating if sequence is safe under Problem Dampener rules
 */
const isSequenceSafeWithDampener = (sequence: NumberSequence): boolean => {
  return isSequenceStrictlySafe(sequence) || canBeMadeSafe(sequence)
}

/**
 * Processes the input file containing number sequences and counts how many sequences
 * are safe according to Problem Dampener rules.
 * @returns Total count of safe sequences
 */
export const partTwo = (): number => {
  const inputPath: string = path.join(__dirname, './data/input.txt')
  const input: string = fs.readFileSync(inputPath, 'utf8')

  const sequences: NumberSequence[] = input
    .trim()
    .split('\n')
    .map(line => line.split(/\s+/).map(Number))

  const safeSequences: NumberSequence[] = sequences.filter(isSequenceSafeWithDampener)
  return safeSequences.length
}
