import * as fs from 'fs'
import * as path from 'path'

/**
 * Represents an equation with a test value and array of numbers
 */
type Equation = {
  testValue: number
  numbers: number[]
}

/**
 * Evaluates an expression by applying operators to numbers in left-to-right order
 * Supports addition (+), multiplication (*), and string concatenation (||)
 * @param numbers - Array of numbers to operate on
 * @param operators - Array of operators to apply between numbers
 * @returns The final result after applying all operations
 */
function evaluateExpression(numbers: number[], operators: string[]): number {
  let result = numbers[0]
  for (let i = 0; i < operators.length; i++) {
    const nextNum = numbers[i + 1]
    switch (operators[i]) {
      case '+':
        result += nextNum
        break
      case '*':
        result *= nextNum
        break
      case '||':
        result = Number(`${result}${nextNum}`)
        break
    }
  }
  return result
}

/**
 * Generates all possible combinations of operators for a given length
 * Includes addition (+), multiplication (*), and concatenation (||)
 * @param length - Number of operators needed in each combination
 * @returns Array of all possible operator combinations
 */
function generateOperatorCombinations(length: number): string[][] {
  const operators = ['+', '*', '||']
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
 * Determines if an equation can be satisfied using any combination of operators
 * Tests all possible operator combinations to find a valid solution
 * @param equation - The equation to evaluate
 * @returns True if any operator combination produces the test value, false otherwise
 */
function canSatisfyEquation(equation: Equation): boolean {
  const numOperators = equation.numbers.length - 1
  const operatorCombinations = generateOperatorCombinations(numOperators)

  return operatorCombinations.some(operators => {
    try {
      return evaluateExpression(equation.numbers, operators) === equation.testValue
    } catch {
      return false
    }
  })
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
 * Solves part two of the puzzle by finding equations that can be satisfied
 * using addition, multiplication, and string concatenation operations
 * @returns Sum of test values from all satisfiable equations
 */
export const partTwo = (): number => {
  const inputPath = path.join(__dirname, './data/input.txt')
  const input = fs.readFileSync(inputPath, 'utf8')

  const equations = parseInput(input)

  return equations
    .filter(equation => canSatisfyEquation(equation))
    .reduce((sum, equation) => sum + equation.testValue, 0)
}
