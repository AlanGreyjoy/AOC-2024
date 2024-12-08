import * as fs from "fs";
import * as path from "path";

function calculateTotalDistance(
  leftList: number[],
  rightList: number[]
): number {
  if (leftList.length !== rightList.length) {
    throw new Error("Lists must have equal length");
  }

  const sortedLeft = [...leftList].sort((a, b) => a - b);
  const sortedRight = [...rightList].sort((a, b) => a - b);

  return sortedLeft.reduce(
    (sum, val, i) => sum + Math.abs(val - sortedRight[i]),
    0
  );
}

export default function dayOne() {
  const inputPath = path.join(__dirname, "input.txt");
  const input = fs.readFileSync(inputPath, "utf8");

  const [leftList, rightList] = input
    .trim()
    .split("\n")
    .reduce(
      (acc, line) => {
        const [left, right] = line.trim().split(/\s+/).map(Number);
        acc[0].push(left);
        acc[1].push(right);
        return acc;
      },
      [[], []] as [number[], number[]]
    );

  const result = calculateTotalDistance(leftList, rightList);

  console.log(`Total distance: ${result}`);
}
