"use client";

import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";
import { useEffect, useState } from "react";
import { useTreeData } from "@/hooks/useTreeData";

export type Node = {
  id: Address;
  level: number;
  parents: Set<Address>;
  children: Set<Address>;
};

export default function Tree({
  currentDonorChoosen,
}: {
  currentDonorChoosen: string | null;
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { branches, mintingBranches } = useTreeData();

  const branchesAll = [...(branches || []), ...(mintingBranches || [])];

  const currentDonor =
    !currentDonorChoosen &&
    branches &&
    branches[branches.length - 1] &&
    mintingBranches?.length === 0
      ? branches[branches.length - 1][branches[branches.length - 1].length - 1]
      : currentDonorChoosen;

  function wait(ms: number) {
    if (currentDonorChoosen) return;
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  useEffect(() => {
    const canvaWrapper = document.getElementById("CanvaWrapper");
    if (canvaWrapper) {
      console.log(canvaWrapper.offsetWidth, canvaWrapper.offsetHeight);
      setDimensions({
        width: canvaWrapper.offsetWidth,
        height: canvaWrapper.offsetHeight,
      });
    }

    const handleResize = () => {
      setDimensions({
        width: canvaWrapper?.offsetWidth || 0,
        height: canvaWrapper?.offsetHeight || 0,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sketch: Sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(dimensions.width, dimensions.height);
      p5.noLoop();
      p5.smooth();
    };

    const setColor = (isCurrent: boolean) => {
      if (isCurrent) {
        setHighlihtColor();
      } else {
        setBaseStrokeColor();
      }
    };
    const setBaseStrokeColor = () => {
      p5.stroke(231, 179, 210, 150);
      p5.strokeWeight(0.9);
    };

    const setHighlihtColor = () => {
      p5.stroke(34, 197, 94);
      p5.fill(34, 197, 94);
      p5.strokeWeight(1.5);

      p5.drawingContext.shadowOffsetX = 3;
      p5.drawingContext.shadowOffsetY = 3;
      p5.drawingContext.shadowBlur = 10;
      p5.drawingContext.shadowColor = "rgba(255, 255, 255, 0.5)";
    };

    const switchShadow = (on: boolean, isCurrent: boolean) => {
      p5.drawingContext.shadowOffsetX = on ? (isCurrent ? 3 : 3) : 0;
      p5.drawingContext.shadowOffsetY = on ? (isCurrent ? 3 : 3) : 0;
      p5.drawingContext.shadowBlur = on ? (isCurrent ? 10 : 10) : 0;
      p5.drawingContext.shadowColor = on
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(0, 0, 0, 0)";
    };

    const setPointsColor = (isCurrent: boolean) => {
      if (isCurrent) {
        p5.stroke(34, 197, 94);
        p5.fill(34, 197, 94);
      } else {
        p5.stroke(231, 179, 210, 150);
        p5.fill(231, 179, 210, 150);
      }
    };

    p5.draw = async () => {
      if (branchesAll.length === 0) return;
      p5.background(0);
      setBaseStrokeColor();

      const allPoints: Record<
        string,
        {
          depth: number;
          x: number;
          y: number;
          // flex: number;
          branchLength: number;
        }
      > = {};
      let maxDepth = 0; // To determine the maximum depth across all branches

      if (!branchesAll) return;
      // First pass to determine the maximum depth
      branchesAll.forEach((branch) => {
        maxDepth = Math.max(maxDepth, branch.length - 1);
      });

      // Assign depths such that the first element is at the bottom
      branchesAll.forEach((branch) => {
        branch.forEach((point, index) => {
          if (!allPoints[point]) {
            allPoints[point] = {
              depth: maxDepth - index,
              x: 0,
              y: 0,
              // flex: branch.length - index,
              branchLength: branch.length,
            }; // Decrease depth as index increases
          }
        });
      });

      // Calculate y positions based on depth
      const margin = 50;
      const spacing = (p5.height - 2 * margin) / maxDepth;

      Object.keys(allPoints).forEach((key) => {
        allPoints[key].y = margin + allPoints[key].depth * spacing;
        // margin + allPoints[key].depth * spacing + allPoints[key].flex;
      });

      const rootPoint = branchesAll[0][0];
      allPoints[rootPoint].y += 30;

      // Calculate x positions
      const branchSpacing = p5.width / (branchesAll.length + 1);
      const centerIndex = Math.floor(branchesAll.length / 2);
      branchesAll.forEach((branch, index) => {
        // Calculate position index from the center
        let positionIndex;
        if (index % 2 === 0) {
          positionIndex = centerIndex + Math.floor(index / 2);
        } else {
          positionIndex = centerIndex - Math.floor((index + 1) / 2);
        }

        const baseX = (positionIndex + 1) * branchSpacing;
        branch.forEach((point) => {
          if (allPoints[point].x === 0) {
            allPoints[point].x = baseX; // Set x position for each point
          }
        });
      });

      // Map to track line usage
      // const lineUsage: Record<string, number> = {};

      let currentId;

      if (branches) {
        for (let i = 0; i < branches.length; i++) {
          const isCurrent =
            branches[i][branches[i].length - 1] === currentDonor;
          if (isCurrent) {
            currentId = i;
          }
          await drawBranch(branches[i], isCurrent);
        }
        if (currentId) {
          await drawBranch(branches[currentId], true);
        }
      }

      if (mintingBranches) {
        for (let i = 0; i < mintingBranches.length; i++) {
          await drawMintingBranch(mintingBranches[i], true, true);
        }
      }

      async function drawDashedLine(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        len: number,
        gap: number
      ) {
        const distance = p5.dist(x1, y1, x2, y2);
        let currentX = x1;
        let currentY = y1;
        const lenRatio = len / (len + gap);
        const gapRatio = gap / (len + gap);

        while (p5.dist(currentX, currentY, x2, y2) > gap) {
          const nextX = currentX + (((x2 - x1) * lenRatio) / distance) * len;
          const nextY = currentY + (((y2 - y1) * lenRatio) / distance) * len;
          p5.stroke(0); // Black color for dash
          p5.line(currentX, currentY, nextX, nextY);

          currentX = nextX + (((x2 - x1) * gapRatio) / distance) * gap;
          currentY = nextY + (((y2 - y1) * gapRatio) / distance) * gap;

          if (p5.dist(currentX, currentY, x2, y2) > len) {
            setHighlihtColor(); // Set color for gap
            p5.line(nextX, nextY, currentX, currentY);
            await wait(10);
          }
        }
      }

      async function drawMintingBranch(branch: string[], isCurrent: boolean) {
        setColor(isCurrent);
        let prev: { x: number; y: number } | null = null;

        const reversedBranch = [...branch].reverse();

        for (let point of reversedBranch) {
          setColor(isCurrent);

          const current = allPoints[point];
          if (prev) {
            await drawDashedLine(prev.x, prev.y, current.x, current.y, 3, 5);
          }

          switchShadow(true, isCurrent);
          setPointsColor(isCurrent);
          p5.ellipse(current.x, current.y, 2, 2);
          // back to "normal" color
          setColor(isCurrent);
          switchShadow(false, isCurrent);

          prev = current;
          await wait(400);
        }
        // await wait(50);
      }

      async function drawBranch(
        branch: string[],
        isCurrent: boolean,
        isMinting: boolean = false
      ) {
        setColor(isCurrent);
        let prev: { x: number; y: number } | null = null;

        branch.forEach(async (point) => {
          setColor(isCurrent);

          const current = allPoints[point];
          if (prev) {
            if (isMinting) {
              drawDashedLine(prev.x, prev.y, current.x, current.y, 3, 5);
              // await wait(10);
            } else {
              p5.line(prev.x, prev.y, current.x, current.y);
            }

            // const lineKey = `${prev.x},${prev.y}-${current.x},${current.y}`;
            // lineUsage[lineKey] = (lineUsage[lineKey] || 0) + 1;
          }

          switchShadow(true, isCurrent);
          setPointsColor(isCurrent);
          p5.ellipse(current.x, current.y, 2, 2);
          // back to "normal" color
          setColor(isCurrent);
          switchShadow(false, isCurrent);

          prev = current;
          await wait(500);
        });
        await wait(50);
      }
    };
  };

  return (
    <div className="w-full h-full" id="CanvaWrapper">
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
}
