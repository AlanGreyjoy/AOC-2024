import * as dayOne from './dayOne'
import * as dayTwo from './dayTwo'
import * as dayThree from './dayThree'
import * as dayFour from './dayFour'
import * as dayFive from './dayFive'
import * as daySix from './daySix'

console.log(`
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
    `)

async function main() {
  console.log('Day One')
  const result = dayOne.partOne()
  const resultTwo = dayOne.partTwo()
  console.log('  Part One Result:', result)
  console.log('  Part Two Result:', resultTwo)

  console.log('')

  console.log('Day Two')
  const dayTwoResult = dayTwo.partOne()
  const dayTwoPartTwoResult = dayTwo.partTwo()
  console.log('  Part One Result:', dayTwoResult)
  console.log('  Part Two Result:', dayTwoPartTwoResult)

  console.log('')

  console.log('Day Three')
  const dayThreePartOneResult = dayThree.partOne()
  const dayThreePartTwoResult = dayThree.partTwo()
  console.log('  Part One Result:', dayThreePartOneResult)
  console.log('  Part Two Result:', dayThreePartTwoResult)

  console.log('')

  console.log('Day Four')
  const dayFourPartOneResult = dayFour.partOne()
  const dayFourPartTwoResult = dayFour.partTwo()
  console.log('  Part One Result:', dayFourPartOneResult)
  console.log('  Part Two Result:', dayFourPartTwoResult)

  console.log('')

  console.log('Day Five')
  const dayFivePartOneResult = dayFive.partOne()
  const dayFivePartTwoResult = dayFive.partTwo()
  console.log('  Part One Result:', dayFivePartOneResult)
  console.log('  Part Two Result:', dayFivePartTwoResult)

  console.log('')

  console.log('Day Six')
  const daySixPartOneResult = daySix.partOne()
  const daySixPartTwoResult = await daySix.partTwo()
  console.log('  Part One Result:', daySixPartOneResult)
  console.log('  Part Two Result:', daySixPartTwoResult)
}

main()
