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

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms); // 1000 milliseconds = 1 second
  });
}

export default function Tree() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { branches } = useTreeData();

  useEffect(() => {
    const canvaWrapper = document.getElementById("CanvaWrapper");
    if (canvaWrapper) {
      // console.log(canvaWrapper.offsetWidth, canvaWrapper.offsetHeight);
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

    p5.draw = async () => {
      p5.background(0);
      p5.stroke(231, 179, 210, 150);

      const allPoints: Record<
        string,
        {
          depth: number;
          x: number;
          y: number;
          flex: number;
          branchLength: number;
        }
      > = {};
      let maxDepth = 0; // To determine the maximum depth across all branches

      if (!branches) return;
      // First pass to determine the maximum depth
      branches.forEach((branch) => {
        maxDepth = Math.max(maxDepth, branch.length - 1);
      });

      // Assign depths such that the first element is at the bottom
      branches.forEach((branch) => {
        branch.forEach((point, index) => {
          if (!allPoints[point]) {
            allPoints[point] = {
              depth: maxDepth - index,
              x: 0,
              y: 0,
              flex: branch.length - index,
              branchLength: branch.length,
            }; // Decrease depth as index increases
          }
        });
      });

      // Calculate y positions based on depth
      const margin = 50;
      const spacing = (p5.height - 2 * margin) / (maxDepth + 1);

      Object.keys(allPoints).forEach((key) => {
        allPoints[key].y =
          margin + allPoints[key].depth * spacing + allPoints[key].flex;
      });

      const rootPoint = branches[0][0];
      allPoints[rootPoint].y += 30;

      // Calculate x positions
      const branchSpacing = p5.width / (branches.length + 1);
      const centerIndex = Math.floor(branches.length / 2);
      branches.forEach((branch, index) => {
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

      for (let i = 0; i < branches.length; i++) {
        await drawBranch(branches[i]);
      }

      async function drawBranch(branch: string[]) {
        let prev: { x: number; y: number } | null = null;
        branch.forEach(async (point) => {
          const current = allPoints[point];
          if (prev) {
            p5.line(prev.x, prev.y, current.x, current.y);

            // const lineKey = `${prev.x},${prev.y}-${current.x},${current.y}`;
            // lineUsage[lineKey] = (lineUsage[lineKey] || 0) + 1;
          }

          // Enable shadow for points
          p5.drawingContext.shadowOffsetX = 3;
          p5.drawingContext.shadowOffsetY = 3;
          p5.drawingContext.shadowBlur = 10;
          p5.drawingContext.shadowColor = "rgba(255, 255, 255, 0.5)";

          p5.stroke(234, 222, 228);

          p5.fill(234, 222, 228);

          p5.ellipse(current.x, current.y, 2, 2);
          p5.stroke(231, 179, 210, 150);

          p5.drawingContext.shadowOffsetX = 0;
          p5.drawingContext.shadowOffsetY = 0;
          p5.drawingContext.shadowBlur = 0;
          p5.drawingContext.shadowColor = "rgba(0, 0, 0, 0)";

          prev = current;
          await wait(20);
        });
        await wait(30);
      }
    };
  };

  return (
    <div className="w-full h-full" id="CanvaWrapper">
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
}
