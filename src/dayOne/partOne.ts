import * as fs from 'fs'
import * as path from 'path'

/**
 * Calculates the total distance between corresponding elements in two sorted arrays
 * @param leftList - First array of numbers to compare
 * @param rightList - Second array of numbers to compare
 * @returns The sum of absolute differences between corresponding elements
 * @throws {Error} If the input arrays have different lengths
 */
function calculateTotalDistance(leftList: number[], rightList: number[]): number {
  if (leftList.length !== rightList.length) {
    throw new Error('Lists must have equal length')
  }

  const sortedLeft = [...leftList].sort((a, b) => a - b)
  const sortedRight = [...rightList].sort((a, b) => a - b)

  return sortedLeft.reduce((sum, val, i) => sum + Math.abs(val - sortedRight[i]), 0)
}

type NumberPair = [number[], number[]]

/**
 * Processes input file containing pairs of numbers and calculates their total distance
 * @returns The total distance between all number pairs in the input
 */
export const partOne = (): number => {
  const inputPath: string = path.join(__dirname, './data/input.txt')
  const input: string = fs.readFileSync(inputPath, 'utf8')

  const [leftList, rightList]: NumberPair = input
    .trim()
    .split('\n')
    .reduce<NumberPair>(
      (acc: NumberPair, line: string) => {
        const parts = line.trim().split(/\s+/)
        const [left, right] = parts as [string, string]
        acc[0].push(Number(left))
        acc[1].push(Number(right))
        return acc
      },
      [[], []]
    )

  const result: number = calculateTotalDistance(leftList, rightList)
  return result
}
