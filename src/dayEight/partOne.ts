import * as fs from 'fs'
import * as path from 'path'
import { parseInput, inBounds } from './utils'

/**
/**
 * Calculates the number of anti-nodes in the grid based on character patterns
 * @returns Number of anti-nodes found
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')
  const grid = input.trim().split('\n')
  const data = parseInput(grid)

  const antiNodes = new Set<string>()

  data.nodes.forEach(locations => {
    for (let a = 0; a < locations.length; a++) {
      for (let b = a + 1; b < locations.length; b++) {
        const aLoc = locations[a]
        const bLoc = locations[b]

        const yDiff = aLoc.y - bLoc.y
        const xDiff = aLoc.x - bLoc.x

        const antiNodeLocations = [
          { y: aLoc.y + yDiff, x: aLoc.x + xDiff },
          { y: bLoc.y - yDiff, x: bLoc.x - xDiff }
        ]

        antiNodeLocations
          .filter(location => inBounds(location, data.height, data.width))
          .forEach(location => antiNodes.add(`${location.y},${location.x}`))
      }
    }
  })

  return antiNodes.size
}
