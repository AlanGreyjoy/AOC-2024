import * as fs from 'fs'
import * as path from 'path'
import { terminal, Terminal } from 'terminal-kit'

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

/** Array of possible movement directions with their deltas and symbols */
const DIRECTIONS: Direction[] = [
  { dx: 0, dy: -1, symbol: '^' },
  { dx: 1, dy: 0, symbol: '>' },
  { dx: 0, dy: 1, symbol: 'v' },
  { dx: -1, dy: 0, symbol: '<' }
]

/**
 * Finds the starting position marked by '^' in the grid
 * @param grid - The 2D grid to search
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
 * @param grid - The 2D grid
 * @returns Boolean indicating if position is valid
 */
function isValidPosition(pos: Position, grid: string[]): boolean {
  return pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[pos.y].length
}

/**
 * Visualizes the current state of the grid in the terminal
 * @param grid - The 2D grid to visualize
 * @param visitedPath - Set of positions that have been visited
 * @param obstaclePos - Position of the placed obstacle, if any
 * @param term - Terminal instance for rendering output
 * @returns Promise that resolves after the visualization delay
 */
function visualizeGrid(
  grid: string[],
  visitedPath: Set<string>,
  obstaclePos: Position | null = null,
  term: Terminal
) {
  term.clear()

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const posKey = `${x},${y}`

      if (obstaclePos && x === obstaclePos.x && y === obstaclePos.y) {
        term.red('O')
      } else if (grid[y][x] === '#') {
        term.gray('█')
      } else if (grid[y][x] === '^') {
        term.yellow('↑')
      } else if (visitedPath.has(posKey)) {
        term.green('·')
      } else {
        term.white('.')
      }
    }
    term('\n')
  }

  return new Promise(resolve => setTimeout(resolve, 100))
}

/**
 * Simulates the guard's movement path through the grid
 * @param grid - The 2D grid representing the environment
 * @param obstaclePos - Optional position of a placed obstacle
 * @param maxSteps - Maximum number of steps to simulate before stopping
 * @param visualize - Whether to display the visualization in terminal
 * @returns Set of all positions visited during the simulation
 * @throws Error when a loop is detected in the path
 */
async function simulateGuardPath(
  grid: string[],
  obstaclePos: Position | null = null,
  maxSteps: number,
  visualize: boolean = false
): Promise<Set<string>> {
  const term = visualize ? terminal : null
  const start = findStartPosition(grid)
  if (!start) return new Set()

  // Use arrays instead of Set for faster operations
  const visited = new Set<string>()
  const positions: [number, number, number][] = [] // [x, y, dirIndex]
  let currentX = start.x
  let currentY = start.y
  let directionIndex = 0
  let steps = 0

  // Fast lookup for positions
  const stateMap = new Map<string, number>()

  while (steps < maxSteps) {
    const state = `${currentX},${currentY},${directionIndex}`

    // Check for loop with faster position tracking
    const previousStep = stateMap.get(state)
    if (previousStep !== undefined) {
      // If we found a loop, we can calculate the cycle length
      const cycleLength = steps - previousStep
      if (cycleLength < maxSteps) {
        throw new Error('Loop detected!')
      }
      break
    }

    stateMap.set(state, steps)
    positions.push([currentX, currentY, directionIndex])

    const direction = DIRECTIONS[directionIndex]
    const nextX = currentX + direction.dx
    const nextY = currentY + direction.dy

    // Early boundary check
    if (nextY < 0 || nextY >= grid.length || nextX < 0 || nextX >= grid[0].length) {
      break
    }

    // Check for obstacles
    if (
      grid[nextY][nextX] === '#' ||
      (obstaclePos !== null && nextX === obstaclePos.x && nextY === obstaclePos.y)
    ) {
      directionIndex = (directionIndex + 1) & 3
    } else {
      currentX = nextX
      currentY = nextY
      visited.add(`${nextX},${nextY}`)
    }

    if (term && visualize && steps % 5 === 0) {
      // Only visualize every 5 steps
      await visualizeGrid(grid, visited, obstaclePos, term)
    }

    steps++
  }

  return visited
}

/**
 * Finds all valid positions where placing an obstacle would create a loop in the guard's path
 * @param grid - The 2D grid representing the environment
 * @param visualize - Whether to display the visualization in terminal
 * @returns The number of positions where placing an obstacle creates a loop
 */
async function findPossibleObstaclePositions(
  grid: string[],
  visualize: boolean = false
): Promise<number> {
  if (visualize) {
    terminal.yellow('\nPress ENTER to start simulation or CTRL+C to exit...\n')
    await new Promise(resolve => terminal.inputField(resolve))
  }

  const start = findStartPosition(grid)
  if (!start) return 0

  const gridHeight = grid.length
  const gridWidth = grid[0].length
  const maxSteps = gridHeight * gridWidth * 4

  let count = 0
  const processed = new Set<string>() // Track processed positions

  // Pre-calculate valid positions to check
  const validPositions: Position[] = []
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x] !== '#' && (x !== start.x || y !== start.y)) {
        validPositions.push({ x, y })
      }
    }
  }

  // Process positions in chunks for better performance
  const chunkSize = 100
  for (let i = 0; i < validPositions.length; i += chunkSize) {
    const chunk = validPositions.slice(i, i + chunkSize)
    await Promise.all(
      chunk.map(async pos => {
        const posKey = `${pos.x},${pos.y}`
        if (processed.has(posKey)) return

        processed.add(posKey)
        try {
          await simulateGuardPath(grid, pos, maxSteps, visualize)
        } catch (error) {
          if (error instanceof Error && error.message === 'Loop detected!') {
            count++
          }
        }
      })
    )
  }

  return count
}

/**
 * Solves the second part of the puzzle by finding all possible obstacle positions
 * that create loops in the guard's path
 * @param visualize - Whether to display the visualization in terminal
 * @returns The number of valid obstacle positions that create loops
 */
export const partTwo = async (visualize: boolean = false): Promise<number> => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')
  const grid = input.trim().split('\n')

  return findPossibleObstaclePositions(grid, visualize)
}

/**
 * Runs the second part of the puzzle with visualization enabled
 * @returns The number of valid obstacle positions that create loops
 */
export const partTwoVisualized = async (): Promise<number> => {
  return partTwo(true)
}
