import * as fs from 'fs'
import * as path from 'path'

/**
 * Calculates the optimized distance based on two lists of numbers.
 * @param leftList - Array of numbers from the left column
 * @param rightList - Array of numbers from the right column
 * @returns The sum of products between each left number and its frequency in the right list
 */
function calculateOptimizedDistance(leftList: number[], rightList: number[]): number {
  const rightFrequency: Record<number, number> = rightList.reduce(
    (acc: Record<number, number>, num) => {
      acc[num] = (acc[num] || 0) + 1
      return acc
    },
    {} as Record<number, number>
  )

  return leftList.reduce((score: number, leftNum: number): number => {
    return score + leftNum * (rightFrequency[leftNum] || 0)
  }, 0)
}

/**
 * Solves part two of the puzzle.
 * Reads input from a file, processes it into two lists of numbers,
 * and calculates the optimized distance between them.
 * @returns The calculated result
 */
export const partTwo = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const [leftList, rightList] = input
    .trim()
    .split('\n')
    .reduce<[number[], number[]]>(
      (acc, line) => {
        const [left, right] = line.trim().split(/\s+/).map(Number)
        acc[0].push(left)
        acc[1].push(right)
        return acc
      },
      [[], []]
    )

  const result = calculateOptimizedDistance(leftList, rightList)
  return result
}
