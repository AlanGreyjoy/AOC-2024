import * as fs from 'fs'
import * as path from 'path'

/** Represents an equation with a test value and array of numbers */
type Equation = {
  testValue: number
  numbers: number[]
}

/**
 * Evaluates an expression by applying operators to numbers from left to right
 * @param numbers - Array of numbers to operate on
 * @param operators - Array of operators ('+' or '*') to apply between numbers
 * @returns The final result after applying all operations
 */
function evaluateExpression(numbers: number[], operators: string[]): number {
  let result = numbers[0]
  for (let i = 0; i < operators.length; i++) {
    const nextNum = numbers[i + 1]
    if (operators[i] === '+') {
      result += nextNum
    } else {
      result *= nextNum
    }
  }
  return result
}

/**
 * Recursively generates all possible combinations of '+' and '*' operators
 * @param length - The number of operators needed in each combination
 * @returns Array containing all possible operator combinations
 */
function generateOperatorCombinations(length: number): string[][] {
  const operators = ['+', '*']
  const combinations: string[][] = []

  function generate(current: string[]) {
    if (current.length === length) {
      combinations.push([...current])
      return
    }
    for (const op of operators) {
      current.push(op)
      generate(current)
      current.pop()
    }
  }

  generate([])
  return combinations
}

/**
 * Determines if an equation can be satisfied by any combination of operators
 * @param equation - The equation to evaluate
 * @returns True if any operator combination produces the test value
 */
function canSatisfyEquation(equation: Equation): boolean {
  const numOperators = equation.numbers.length - 1
  const operatorCombinations = generateOperatorCombinations(numOperators)

  return operatorCombinations.some(
    operators => evaluateExpression(equation.numbers, operators) === equation.testValue
  )
}

/**
 * Converts raw input string into structured equation objects
 * @param input - Raw input string containing equations
 * @returns Array of parsed Equation objects
 */
function parseInput(input: string): Equation[] {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [testValue, numbersStr] = line.split(': ')
      const numbers = numbersStr.split(' ').map(Number)
      return {
        testValue: Number(testValue),
        numbers
      }
    })
}

/**
 * Solves part one of the puzzle by finding equations that can be satisfied
 * and summing their test values
 * @returns The sum of test values from all satisfiable equations
 */
export const partOne = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const equations = parseInput(input)

  return equations
    .filter(equation => canSatisfyEquation(equation))
    .reduce((sum, equation) => sum + equation.testValue, 0)
}
