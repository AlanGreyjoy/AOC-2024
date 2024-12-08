import * as fs from 'fs'
import * as path from 'path'

/**
 * Extracts numbers from enabled multiplication instructions based on control flags
 * @param text - Raw input string containing multiplication operations and control flags
 * @returns Array of multiplication results for enabled operations
 */
function extractEnabledMultiplications(text: string): number[] {
  const results: number[] = []
  const mulPattern: RegExp = /mul\(([1-9]\d{0,2}),([1-9]\d{0,2})\)/g
  const controlPattern: RegExp = /(do|don't)\(\)/g

  let isEnabled = true
  const controls: { position: number; enabled: boolean }[] = []

  let controlMatch
  while ((controlMatch = controlPattern.exec(text)) !== null) {
    controls.push({
      position: controlMatch.index,
      enabled: controlMatch[1] === 'do'
    })
  }

  let mulMatch: RegExpExecArray | null
  while ((mulMatch = mulPattern.exec(text)) !== null) {
    const lastControl = controls
      .filter(c => c.position < mulMatch!.index)
      .sort((a, b) => b.position - a.position)[0]

    isEnabled = lastControl ? lastControl.enabled : true

    if (isEnabled) {
      const x: number = parseInt(mulMatch[1])
      const y: number = parseInt(mulMatch[2])
      if (x > 0 && x < 1000 && y > 0 && y < 1000) {
        results.push(x * y)
      }
    }
  }

  return results
}

/**
 * Calculates the sum of all enabled multiplication operations in the input file
 * @returns Total sum of enabled multiplication results
 */
export const partTwo = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const multiplications = extractEnabledMultiplications(input)
  return multiplications.reduce((sum, result) => sum + result, 0)
}
