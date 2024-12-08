import * as fs from 'fs'
import * as path from 'path'

type Rule = {
  before: number
  after: number
}

/**
 * Parses input string into rules and updates arrays
 * @param input - Raw input string containing rules and updates sections
 * @returns Tuple containing array of rules and array of number arrays for updates
 */
function parseInput(input: string): [Rule[], number[][]] {
  const [rulesSection, updatesSection] = input.trim().split('\n\n')

  const rules: Rule[] = rulesSection.split('\n').map(line => {
    const [before, after] = line.split('|').map(Number)
    return { before, after }
  })

  const updates: number[][] = updatesSection.split('\n').map(line => line.split(',').map(Number))

  return [rules, updates]
}

/**
 * Validates if a number sequence follows all ordering rules
 * @param update - Array of numbers to validate
 * @param rules - Array of Rule objects defining valid number ordering
 * @returns Boolean indicating if the update follows all rules
 */
function isValidUpdate(update: number[], rules: Rule[]): boolean {
  for (const rule of rules) {
    if (update.includes(rule.before) && update.includes(rule.after)) {
      const beforeIndex = update.indexOf(rule.before)
      const afterIndex = update.indexOf(rule.after)
      if (afterIndex < beforeIndex) {
        return false
      }
    }
  }
  return true
}

/**
 * Retrieves the middle element from an array of numbers
 * @param arr - Array of numbers
 * @returns The middle number in the array
 */
function getMiddleNumber(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)]
}

/**
 * Solves part one of day five puzzle
 * Processes input file to find valid updates and calculates sum of middle numbers
 * @returns Sum of middle numbers from valid updates
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const [rules, updates] = parseInput(input)

  const validUpdates = updates.filter(update => isValidUpdate(update, rules))

  return validUpdates.reduce((sum, update) => sum + getMiddleNumber(update), 0)
}
