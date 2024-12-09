import * as fs from 'fs'
import * as path from 'path'
import { parseInput, inBounds } from './utils'

/**
 * Calculates anti-nodes in the grid based on pairs of matching characters
 * For each pair of matching characters, traces lines in both directions and marks all points
 * @param grid - Array of strings representing the input grid
 * @returns Total number of unique anti-node positions
 */
function getAntiNodes(grid: string[]): number {
  const data = parseInput(grid)
  const antiNodes = new Set<string>()

  data.nodes.forEach(locations => {
    for (let a = 0; a < locations.length; a++) {
      for (let b = a + 1; b < locations.length; b++) {
        const aLoc = locations[a]
        const bLoc = locations[b]

        const yDiff = aLoc.y - bLoc.y
        const xDiff = aLoc.x - bLoc.x

        let stillInBounds = true
        for (let i = 0; stillInBounds; i++) {
          const location = {
            y: aLoc.y + yDiff * i,
            x: aLoc.x + xDiff * i
          }

          if (!inBounds(location, data.height, data.width)) {
            stillInBounds = false
          } else {
            antiNodes.add(`${location.y},${location.x}`)
          }
        }

        stillInBounds = true
        for (let i = 0; stillInBounds; i++) {
          const location = {
            y: bLoc.y - yDiff * i,
            x: bLoc.x - xDiff * i
          }

          if (!inBounds(location, data.height, data.width)) {
            stillInBounds = false
          } else {
            antiNodes.add(`${location.y},${location.x}`)
          }
        }
      }
    }
  })

  return antiNodes.size
}

/**
 * Solves part two of the puzzle
 * Reads the input file and calculates the total number of anti-nodes
 * @returns Number of anti-nodes in the grid
 */
export const partTwo = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')
  const grid = input.trim().split('\n')

  return getAntiNodes(grid)
}
