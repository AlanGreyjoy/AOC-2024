import * as fs from 'fs'
import * as path from 'path'

type Rule = {
  before: number
  after: number
}

/**
 * Creates a dependency graph from rules
 * @param {Rule[]} rules - Array of rules containing before and after numbers
 * @returns {Map<number, Set<number>>} A map representing the dependency graph
 */
function createDependencyGraph(rules: Rule[]): Map<number, Set<number>> {
  const graph = new Map<number, Set<number>>()

  for (const rule of rules) {
    if (!graph.has(rule.before)) {
      graph.set(rule.before, new Set<number>())
    }
    if (!graph.has(rule.after)) {
      graph.set(rule.after, new Set<number>())
    }
    graph.get(rule.after)!.add(rule.before)
  }

  return graph
}

/**
 * Topologically sorts numbers based on dependencies
 * @param {number[]} numbers - Array of numbers to sort
 * @param {Map<number, Set<number>>} graph - Dependency graph
 * @returns {number[]} Sorted array of numbers
 */
function topologicalSort(numbers: number[], graph: Map<number, Set<number>>): number[] {
  const result = [...numbers]
  let hasSwapped
  do {
    hasSwapped = false
    for (let i = 0; i < result.length - 1; i++) {
      const deps = graph.get(result[i]) || new Set()
      if (deps.has(result[i + 1])) {
        ;[result[i], result[i + 1]] = [result[i + 1], result[i]]
        hasSwapped = true
      }
    }
  } while (hasSwapped)

  return result
}

/**
 * Checks if an update is in correct order according to rules
 * @param {number[]} update - Array of numbers to check
 * @param {Map<number, Set<number>>} graph - Dependency graph
 * @returns {boolean} True if order is correct, false otherwise
 */
function isCorrectOrder(update: number[], graph: Map<number, Set<number>>): boolean {
  for (let i = 0; i < update.length - 1; i++) {
    const deps = graph.get(update[i]) || new Set()
    if (deps.has(update[i + 1])) {
      return false
    }
  }
  return true
}

/**
 * Gets middle number from an array
 * @param {number[]} arr - Input array
 * @returns {number} Middle number from the array
 */
function getMiddleNumber(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)]
}

/**
 * Parses input into rules and updates
 * @param {string} input - Raw input string
 * @returns {[Rule[], number[][]]} Tuple containing rules and updates arrays
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
 * Solves part two of day five
 * @returns {number} Sum of middle numbers from corrected updates
 */
export const partTwo = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const [rules, updates] = parseInput(input)
  const graph = createDependencyGraph(rules)

  const incorrectUpdates = updates.filter(update => !isCorrectOrder(update, graph))
  const correctedUpdates = incorrectUpdates.map(update => topologicalSort(update, graph))

  return correctedUpdates.reduce((sum, update) => sum + getMiddleNumber(update), 0)
}
