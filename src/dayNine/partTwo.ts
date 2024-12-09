import * as fs from 'fs'
import * as path from 'path'

interface File {
  id: number
  startPos: number
  size: number
}

/**
 * Parses input string into disk array representation
 * @param input - String of numbers representing file sizes
 * @returns Array representing initial disk state
 */
function parseInput(input: string): number[] {
  const numbers = input.split('').map(Number)
  const disk: number[] = []
  let fileId = 0

  for (let i = 0; i < numbers.length; i++) {
    const size = numbers[i]
    for (let j = 0; j < size; j++) {
      disk.push(i % 2 === 0 ? fileId : -1)
    }
    if (i % 2 === 0) fileId++
  }

  return disk
}

/**
 * Identifies and extracts file information from disk array
 * @param disk - Array representing the disk state
 * @returns Array of File objects containing file metadata
 */
function findFiles(disk: number[]): File[] {
  const files: File[] = []
  let currentFile: File | null = null

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] >= 0) {
      if (!currentFile || currentFile.id !== disk[i]) {
        if (currentFile) {
          files.push(currentFile)
        }
        currentFile = { id: disk[i], startPos: i, size: 1 }
      } else {
        currentFile.size++
      }
    }
  }
  if (currentFile) {
    files.push(currentFile)
  }

  return files
}

/**
 * Checks if there is enough contiguous space at a position
 * @param disk - Array representing the disk state
 * @param startPos - Starting position to check
 * @param size - Required size of space
 * @returns Boolean indicating if space is available
 */
function hasEnoughSpace(disk: number[], startPos: number, size: number): boolean {
  if (startPos + size > disk.length) return false

  for (let i = 0; i < size; i++) {
    if (disk[startPos + i] !== -1) return false
  }
  return true
}

/**
 * Finds the first position where a file can fit
 * @param disk - Array representing the disk state
 * @param fileSize - Size of file to fit
 * @param maxPos - Maximum position to search up to
 * @returns Position where file fits or -1 if no space found
 */
function findFirstFit(disk: number[], fileSize: number, maxPos: number): number {
  for (let pos = 0; pos < maxPos; pos++) {
    if (hasEnoughSpace(disk, pos, fileSize)) {
      return pos
    }
  }
  return -1
}

/**
 * Compacts the disk by moving files to earlier positions when possible
 * @param disk - Array representing the disk state
 * @returns New array representing compacted disk state
 */
function compactDisk(disk: number[]): number[] {
  const result = [...disk]
  const files = findFiles(result)
  files.sort((a, b) => b.id - a.id)

  for (const file of files) {
    const newPos = findFirstFit(result, file.size, file.startPos)

    if (newPos !== -1 && newPos < file.startPos) {
      for (let i = 0; i < file.size; i++) {
        result[file.startPos + i] = -1
      }
      for (let i = 0; i < file.size; i++) {
        result[newPos + i] = file.id
      }
    }
  }

  return result
}

/**
 * Calculates checksum based on file positions and IDs
 * @param disk - Array representing the disk state
 * @returns Checksum as BigInt
 */
function calculateChecksum(disk: number[]): bigint {
  return disk.reduce((sum, fileId, position) => {
    if (fileId === -1) return sum
    return sum + BigInt(position) * BigInt(fileId)
  }, BigInt(0))
}

/**
 * Solves part two of day nine challenge
 * @returns Solution as BigInt
 */
export const partTwo = (): bigint => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8').trim()
  const disk = parseInput(input)
  const compactedDisk = compactDisk(disk)
  return calculateChecksum(compactedDisk)
}
