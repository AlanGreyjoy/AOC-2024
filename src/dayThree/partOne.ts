import * as fs from 'fs'
import * as path from 'path'

/**
 * Extracts numbers from multiplication instructions in the format mul(X,Y)
 * Multiplies the numbers and returns array of results
 * @param text - Input string containing multiplication instructions
 * @returns Array of multiplication results where both numbers are between 1-999
 */
function extractMultiplications(text: string): number[] {
  const results: number[] = []
  const pattern: RegExp = /mul\(([1-9]\d{0,2}),([1-9]\d{0,2})\)/g

  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    const x: number = parseInt(match[1])
    const y: number = parseInt(match[2])
    if (x > 0 && x < 1000 && y > 0 && y < 1000) {
      const result: number = x * y
      results.push(result)
    }
  }

  return results
}

/**
 * Solves part one by finding all valid multiplication instructions
 * and returning the sum of their results
 * @returns Sum of all multiplication results
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const multiplications = extractMultiplications(input)
  return multiplications.reduce((sum, result) => sum + result, 0)
}
