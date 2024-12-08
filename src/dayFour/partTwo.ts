import * as fs from 'fs'
import * as path from 'path'

/**
 * Represents a position in a 2D grid with x and y coordinates
 */
type Position = {
  x: number
  y: number
}

/**
 * Represents the five points that make up an X pattern
 */
type XPattern = {
  topLeft: Position
  topRight: Position
  center: Position
  bottomLeft: Position
  bottomRight: Position
}

/**
 * Checks if a given position is within the bounds of the grid
 * @param x - The x coordinate to check
 * @param y - The y coordinate to check
 * @param grid - The 2D grid to check against
 * @returns True if the position is valid, false otherwise
 */
function isValidPosition(x: number, y: number, grid: string[]): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length
}

/**
 * Checks if a sequence of three characters spells 'MAS' or 'SAM' starting from a position
 * @param start - The starting position
 * @param dx - The x direction increment
 * @param dy - The y direction increment
 * @param grid - The 2D grid to check
 * @returns True if 'MAS' or 'SAM' is found, false otherwise
 */
function checkMAS(start: Position, dx: number, dy: number, grid: string[]): boolean {
  const target = 'MAS'
  const reversedTarget = 'SAM'
  let forward = ''
  let backward = ''

  for (let i = 0; i < 3; i++) {
    const x = start.x + dx * i
    const y = start.y + dy * i
    if (!isValidPosition(x, y, grid)) return false
    forward += grid[y][x]
    backward = grid[y][x] + backward
  }

  return forward === target || backward === target
}

/**
 * Validates if a given center position forms a valid XMAS pattern
 * @param center - The center position of the potential X pattern
 * @param grid - The 2D grid to check
 * @returns True if a valid XMAS pattern is found, false otherwise
 */
function isValidXMAS(center: Position, grid: string[]): boolean {
  const pattern: XPattern = {
    topLeft: { x: center.x - 1, y: center.y - 1 },
    topRight: { x: center.x + 1, y: center.y - 1 },
    center,
    bottomLeft: { x: center.x - 1, y: center.y + 1 },
    bottomRight: { x: center.x + 1, y: center.y + 1 }
  }

  if (!Object.values(pattern).every(pos => isValidPosition(pos.x, pos.y, grid))) {
    return false
  }

  if (grid[center.y][center.x] !== 'A') {
    return false
  }

  const topLeftToBottomRight = checkMAS(pattern.topLeft, 1, 1, grid)
  const topRightToBottomLeft = checkMAS(pattern.topRight, -1, 1, grid)

  return topLeftToBottomRight && topRightToBottomLeft
}

/**
 * Counts the number of valid XMAS patterns in the grid
 * @param grid - The 2D grid to search for patterns
 * @returns The total number of valid XMAS patterns found
 */
function countXMASPatterns(grid: string[]): number {
  let count = 0

  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[y].length - 1; x++) {
      if (grid[y][x] === 'A' && isValidXMAS({ x, y }, grid)) {
        count++
      }
    }
  }

  return count
}

/**
 * Solves part two of the puzzle by finding all valid XMAS patterns in the input
 * @returns The total number of valid XMAS patterns found in the input
 */
export const partTwo = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')
  const grid = input.trim().split('\n')

  return countXMASPatterns(grid)
}
