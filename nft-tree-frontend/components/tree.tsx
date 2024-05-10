"use client";

import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";
import p5 from "p5";
import { useEffect, useState } from "react";
import { processBranchData } from "./mockData";

interface TreeProps {
  nodes: Node[];
}

// export const treasuryAddress = "0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811";

export type Node = {
  id: Address;
  level: number;
  parents: Set<Address>;
  children: Set<Address>;
};

const branches = processBranchData();

export default function Tree({ nodes }: TreeProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    p5.draw = () => {
      p5.background(0);
      p5.stroke(231, 179, 210);

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

      // let accumulatedSpacing = spacing;

      Object.keys(allPoints).forEach((key) => {
        allPoints[key].y =
          margin + allPoints[key].depth * spacing + allPoints[key].flex;

        // allPoints[key].y =
        //   margin +
        //   (allPoints[key].depth * spacing + allPoints[key].flex) *
        //     (allPoints[key].flex / allPoints[key].branchLength);
      });

      allPoints["0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811"].y += 30;

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
      const lineUsage: Record<string, number> = {};

      // Draw lines, points, and labels
      let i = 0;
      branches.forEach((branch) => {
        i++;
        let prev: { x: number; y: number } | null = null;
        branch.forEach((point) => {
          const current = allPoints[point];
          if (prev) {
            p5.line(prev.x, prev.y, current.x, current.y);
            const lineKey = `${prev.x},${prev.y}-${current.x},${current.y}`;
            lineUsage[lineKey] = (lineUsage[lineKey] || 0) + 1;
            const weight = lineUsage[lineKey] > 1 ? 3 : 1;
            // p5.strokeWeight(weight); // Set the line thickness based on usage
            p5.line(prev.x, prev.y, current.x, current.y);
          }
          p5.strokeWeight(1); // Reset the line thickness for points and text
          p5.ellipse(current.x, current.y, 2, 2);
          // p5.text(point.slice(2, 5), current.x + 5, current.y + 5);
          prev = current;
        });
        const lastPoint = branch[branch.length - 1];
        const current = allPoints[lastPoint];
        // p5.text(i, current.x + 5, current.y - 20);
        // p5.ellipse(current.x, current.y, 5, 6);
        // console.log(lastPoint);
      });
    };
  };

  return (
    <div className="w-full h-full" id="CanvaWrapper">
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
}
