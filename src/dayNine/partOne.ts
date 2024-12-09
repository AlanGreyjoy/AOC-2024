import * as fs from 'fs'
import * as path from 'path'

/**
 * Represents a block in the disk storage system
 * @interface Block
 * @property {number | null} fileId - Unique identifier for the file, null represents free space
 * @property {number} size - Size of the block
 */
interface Block {
  fileId: number | null
  size: number
}

/**
 * Parses input string into an array of blocks
 * @param {string} input - Raw input string containing numbers
 * @returns {Block[]} Array of Block objects
 */
function parseInput(input: string): Block[] {
  const numbers = input.split('').map(Number)
  const blocks: Block[] = []
  let fileId = 0

  for (let i = 0; i < numbers.length; i++) {
    blocks.push({
      fileId: i % 2 === 0 ? fileId++ : null,
      size: numbers[i]
    })
  }

  return blocks
}

/**
 * Expands blocks into an array where each number represents a single unit of space
 * @param {Block[]} blocks - Array of Block objects
 * @returns {number[]} Expanded array where -1 represents free space
 */
function expandBlocks(blocks: Block[]): number[] {
  const expanded: number[] = []

  blocks.forEach(block => {
    for (let i = 0; i < block.size; i++) {
      expanded.push(block.fileId === null ? -1 : block.fileId)
    }
  })

  return expanded
}

/**
 * Compacts the disk by moving files to the leftmost available free space
 * @param {number[]} disk - Array representing the disk state
 * @returns {number[]} Compacted disk array
 */
function compactDisk(disk: number[]): number[] {
  const result = [...disk]

  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i] === -1) continue

    let targetIdx = -1
    for (let j = 0; j < i; j++) {
      if (result[j] === -1) {
        targetIdx = j
        break
      }
    }

    if (targetIdx !== -1) {
      result[targetIdx] = result[i]
      result[i] = -1
    }
  }

  return result
}

/**
 * Calculates checksum based on file positions and IDs
 * @param {number[]} disk - Array representing the disk state
 * @returns {number} Calculated checksum
 */
function calculateChecksum(disk: number[]): number {
  return disk.reduce((sum, fileId, position) => {
    if (fileId === -1) return sum
    return sum + position * fileId
  }, 0)
}

/**
 * Solves part one of the puzzle
 * @returns {number} Solution to part one
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8').trim()

  const blocks = parseInput(input)
  const expandedDisk = expandBlocks(blocks)
  const compactedDisk = compactDisk(expandedDisk)

  return calculateChecksum(compactedDisk)
}
