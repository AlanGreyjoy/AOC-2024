import * as dayOne from './dayOne'
import * as dayTwo from './dayTwo'
import * as dayThree from './dayThree'
import * as dayFour from './dayFour'
import * as dayFive from './dayFive'
import * as daySix from './daySix'
import * as daySeven from './daySeven'
import { terminal as term } from 'terminal-kit'

/** ASCII art banner for the application */
const asciiArt = `
       __
    .-'  |
   /   <\\|
  /     \\'
  |_.- o-o
  / C  -._)\\
 /',        |
|   \`-,_,__,'
(,,)====[_]=|
  '.   ____/
   | -|-|_
   |____)_) [aoc - Alan Spurlock 2024]
    `

/** Challenge configuration for each day's puzzles */
const challenges = [
  { name: 'Day One', parts: [dayOne.partOne, dayOne.partTwo] },
  { name: 'Day Two', parts: [dayTwo.partOne, dayTwo.partTwo] },
  { name: 'Day Three', parts: [dayThree.partOne, dayThree.partTwo] },
  { name: 'Day Four', parts: [dayFour.partOne, dayFour.partTwo] },
  { name: 'Day Five', parts: [dayFive.partOne, dayFive.partTwo] },
  { name: 'Day Seven', parts: [daySeven.partOne, daySeven.partTwo] }
]

/**
 * Runs a function with a progress spinner animation
 * @param fn - Async function to execute
 * @returns Promise resolving to the function's result
 */
async function runWithSpinner(fn: () => Promise<any>): Promise<any> {
  return new Promise(async resolve => {
    term('\n')

    const progressBar = term.progressBar({
      width: 80,
      title: 'Computing:',
      eta: true,
      percent: true,
      syncMode: true,
      barStyle: term.brightBlue,
      barBracketStyle: term.cyan,
      percentStyle: term.brightYellow
    })

    let progress = 0
    const updateInterval = setInterval(() => {
      progress = Math.min(progress + 0.01, 0.95)
      progressBar.update(progress)
    }, 50)

    try {
      const result = await fn()
      clearInterval(updateInterval)
      progressBar.update(1)

      await new Promise(r => setTimeout(r, 200))

      progressBar.stop()
      term.eraseLine()
      term.previousLine(1)
      term.eraseLine()
      term('\n')
      resolve(result)
    } catch (error) {
      clearInterval(updateInterval)
      progressBar.stop()
      term.eraseLine()
      term.previousLine(1)
      term.eraseLine()
      throw error
    }
  })
}

/**
 * Main application entry point
 * Displays an interactive menu for selecting and running Advent of Code challenges
 */
async function main() {
  term.clear()

  term.cyan(asciiArt + '\n')

  while (true) {
    const items = challenges.map(c => c.name).concat(['Exit'])

    term.cyan('\nSelect a challenge to run (use arrow keys):\n')

    const response = await new Promise<{ selectedText: string; selectedIndex: number }>(resolve => {
      term.singleColumnMenu(items, (error, response) => {
        resolve(response)
      })
    })

    if (response.selectedText === 'Exit') {
      term.clear()
      process.exit(0)
    }

    const challenge = challenges[response.selectedIndex]

    // Sub-menu for parts
    term.cyan(`\nSelect which part of ${challenge.name} to run:\n`)
    const partItems = ['Part One', 'Part Two', 'Both', 'Back']

    const partResponse = await new Promise<{ selectedText: string; selectedIndex: number }>(
      resolve => {
        term.singleColumnMenu(partItems, (error, response) => {
          resolve(response)
        })
      }
    )

    term('\n')

    if (partResponse.selectedText !== 'Back') {
      term.cyan(`Running ${challenge.name}:\n`)

      if (['Part One', 'Both'].includes(partResponse.selectedText)) {
        term('\n')
        const result = await runWithSpinner(async () => {
          await new Promise(r => setTimeout(r, 500))
          return challenge.parts[0]()
        })
        term.green(`  Part One Result: ${result}\n`)
      }

      if (['Part Two', 'Both'].includes(partResponse.selectedText)) {
        term('\n')
        const result = await runWithSpinner(async () => {
          await new Promise(r => setTimeout(r, 500))
          return challenge.parts[1]()
        })
        term.green(`  Part Two Result: ${result}\n`)
      }

      term.cyan('\nPress any key to continue...')
      await new Promise(resolve => term.once('key', resolve))
    }

    term.clear()
  }
}

main()
