import * as fs from 'fs'
import * as path from 'path'

/**
 * Represents a direction vector with x and y components
 */
type Direction = {
  dx: number
  dy: number
}

/**
 * Array of all possible directions (horizontal, vertical, and diagonal)
 */
const DIRECTIONS: Direction[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: -1 }
]

/**
 * Checks if a given position is within the grid boundaries
 * @param x - The x coordinate to check
 * @param y - The y coordinate to check
 * @param grid - The 2D grid to check against
 * @returns boolean indicating if the position is valid
 */
function isValidPosition(x: number, y: number, grid: string[]): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length
}

/**
 * Checks if 'XMAS' exists starting from a position in a given direction
 * @param x - Starting x coordinate
 * @param y - Starting y coordinate
 * @param direction - Direction to check
 * @param grid - The 2D grid to check in
 * @returns boolean indicating if 'XMAS' was found
 */
function checkXMAS(x: number, y: number, direction: Direction, grid: string[]): boolean {
  const target = 'XMAS'

  for (let i = 0; i < target.length; i++) {
    const newX = x + direction.dx * i
    const newY = y + direction.dy * i

    if (!isValidPosition(newX, newY, grid) || grid[newY][newX] !== target[i]) {
      return false
    }
  }

  return true
}

/**
 * Counts the number of times 'XMAS' appears in the grid in any direction
 * @param grid - The 2D grid to search in
 * @returns The total number of 'XMAS' occurrences
 */
function countXMASOccurrences(grid: string[]): number {
  let count = 0

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'X') {
        for (const direction of DIRECTIONS) {
          if (checkXMAS(x, y, direction, grid)) {
            count++
          }
        }
      }
    }
  }

  return count
}

/**
 * Solves part one of the puzzle
 * @returns The number of times 'XMAS' appears in the input grid
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')
  const grid = input.trim().split('\n')

  return countXMASOccurrences(grid)
}
