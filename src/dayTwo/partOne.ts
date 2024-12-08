import * as fs from 'fs'
import * as path from 'path'

type NumberSequence = number[]
type SafetyValidator = (sequence: NumberSequence) => boolean

/**
 * Validates if a numeric sequence follows safety rules:
 * - Must be strictly increasing or strictly decreasing
 * - Adjacent numbers must have a difference between 1 and 3 (inclusive)
 * @param sequence - Array of numbers to validate
 * @returns boolean indicating if the sequence follows safety rules
 */
const isSequenceSafe: SafetyValidator = (sequence): boolean => {
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
 * Processes input file containing number sequences and counts how many sequences
 * follow the safety rules
 * @returns Total count of safe sequences found in the input file
 */
export const partOne = (): number => {
  const inputPath: string = path.join(__dirname, './data/input.txt')
  const input: string = fs.readFileSync(inputPath, 'utf8')

  const sequences: NumberSequence[] = input
    .trim()
    .split('\n')
    .map(line => line.split(/\s+/).map(Number))

  const safeSequences: NumberSequence[] = sequences.filter(isSequenceSafe)
  return safeSequences.length
}
