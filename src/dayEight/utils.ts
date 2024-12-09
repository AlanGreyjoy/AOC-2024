import { Node } from './types'

/**
 * Parses the input grid and creates a map of characters to their locations
 * @param grid - Array of strings representing the input grid
 * @returns Object containing grid dimensions and map of characters to their locations
 */
export function parseInput(grid: string[]): {
  height: number
  width: number
  nodes: Map<string, Node[]>
} {
  const height = grid.length
  const width = grid[0].length
  const nodes = new Map<string, Node[]>()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const current = grid[y][x]
      if (current !== '.') {
        const locations = nodes.get(current) || []
        locations.push({ y, x })
        nodes.set(current, locations)
      }
    }
  }

  return { height, width, nodes }
}

/**
 * Checks if a location is within the grid boundaries
 * @param location - Node coordinates to check
 * @param height - Grid height
 * @param width - Grid width
 * @returns Boolean indicating if location is within bounds
 */
export function inBounds(location: Node, height: number, width: number): boolean {
  return location.y >= 0 && location.y < height && location.x >= 0 && location.x < width
}
