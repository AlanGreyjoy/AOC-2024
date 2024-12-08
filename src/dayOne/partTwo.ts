import * as fs from "fs";
import * as path from "path";

function calculateOptimizedDistance(
  leftList: number[],
  rightList: number[]
): number {
  const rightFrequency: Record<number, number> = rightList.reduce(
    (acc: Record<number, number>, num) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return leftList.reduce((score: number, leftNum: number): number => {
    return score + leftNum * (rightFrequency[leftNum] || 0);
  }, 0);
}

export const partTwo = (): number => {
  const inputPath = path.join(__dirname, "./data/input.txt");
  const input = fs.readFileSync(inputPath, "utf8");

  const [leftList, rightList] = input
    .trim()
    .split("\n")
    .reduce<[number[], number[]]>(
      (acc, line) => {
        const [left, right] = line.trim().split(/\s+/).map(Number);
        acc[0].push(left);
        acc[1].push(right);
        return acc;
      },
      [[], []]
    );

  const result = calculateOptimizedDistance(leftList, rightList);
  return result;
};
