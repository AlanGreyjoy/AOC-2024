import * as fs from 'fs'
import * as path from 'path'

/** Represents a position in the grid with x and y coordinates */
type Position = {
  x: number
  y: number
}

/** Represents a direction with movement deltas and its symbol */
type Direction = {
  dx: number
  dy: number
  symbol: string
}

/** Array of possible directions the guard can move in */
const DIRECTIONS: Direction[] = [
  { dx: 0, dy: -1, symbol: '^' },
  { dx: 1, dy: 0, symbol: '>' },
  { dx: 0, dy: 1, symbol: 'v' },
  { dx: -1, dy: 0, symbol: '<' }
]

/**
 * Finds the starting position marked by '^' in the grid
 * @param grid - The input grid represented as string array
 * @returns The starting position or null if not found
 */
function findStartPosition(grid: string[]): Position | null {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '^') {
        return { x, y }
      }
    }
  }
  return null
}

/**
 * Checks if a position is within the grid boundaries
 * @param pos - The position to check
 * @param grid - The input grid
 * @returns Boolean indicating if position is valid
 */
function isValidPosition(pos: Position, grid: string[]): boolean {
  return pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[pos.y].length
}

/**
 * Checks if a position contains an obstacle ('#')
 * @param pos - The position to check
 * @param grid - The input grid
 * @returns Boolean indicating if position contains an obstacle
 */
function isObstacle(pos: Position, grid: string[]): boolean {
  return grid[pos.y][pos.x] === '#'
}

/**
 * Simulates the guard's path through the grid and counts unique positions visited
 * @param grid - The input grid representing the area
 * @returns Number of unique positions visited by the guard
 */
function simulateGuardPath(grid: string[]): number {
  const start = findStartPosition(grid)
  if (!start) return 0

  const visited = new Set<string>()
  let currentPos = { ...start }
  let directionIndex = 0 // Start facing up

  visited.add(`${currentPos.x},${currentPos.y}`)

  while (true) {
    const direction = DIRECTIONS[directionIndex]
    const nextPos = {
      x: currentPos.x + direction.dx,
      y: currentPos.y + direction.dy
    }

    // Check if next position is valid and not an obstacle
    if (!isValidPosition(nextPos, grid)) {
      break // Guard has left the area
    }

    if (grid[nextPos.y][nextPos.x] === '#') {
      // Turn right
      directionIndex = (directionIndex + 1) % 4
    } else {
      // Move forward
      currentPos = nextPos
      visited.add(`${currentPos.x},${currentPos.y}`)
    }
  }

  return visited.size
}

/**
 * Solves part one of the puzzle
 * @returns The solution number representing total unique positions visited
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')
  const grid = input.trim().split('\n')

  return simulateGuardPath(grid)
}
