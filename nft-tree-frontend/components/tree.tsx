"use client";

import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";
import { useEffect, useState } from "react";
import { processBranchData } from "./mockData";
import { useTreeData } from "@/hooks/useTreeData";

// interface TreeProps {
//   nodes: Node[];
// }

export type Node = {
  id: Address;
  level: number;
  parents: Set<Address>;
  children: Set<Address>;
};

// const branches = processBranchData();

// Define TypeScript types for state
// interface SketchState {
//   zoom: number;
//   centerX: number;
//   centerY: number;
// }

export default function Tree() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // const [zoom, setZoom] = useState(1);
  // const [offset, setOffset] = useState({ x: 0, y: 0 }); // Initial offset for panning
  // const [dragging, setDragging] = useState(false); // Dragging state
  // const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 }); // Last mouse position

  // const [sketchState, setSketchState] = useState<SketchState>({
  //   zoom: 1,
  //   centerX: 0,
  //   centerY: 0,
  // });

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

    // p5.mouseWheel = (event: React.WheelEvent) => {
    //   if (event) {
    //     event.preventDefault();
    //     // Calculate the new zoom level
    //     const scaleFactor = 1.05;
    //     const newZoom =
    //       event.deltaY > 0
    //         ? sketchState.zoom / scaleFactor
    //         : sketchState.zoom * scaleFactor;

    //     // Update center based on deltaX and deltaY, adjust with current zoom for consistency
    //     const newCenterX = sketchState.centerX - event.deltaX / newZoom;
    //     const newCenterY = sketchState.centerY - event.deltaY / newZoom;

    //     // Set new state
    //     setSketchState({
    //       zoom: newZoom,
    //       centerX: newCenterX,
    //       centerY: newCenterY,
    //     });
    //   }
    // };

    // p5.mousePressed = () => {
    //   console.log("mousePressed");
    //   setDragging(true);
    //   setLastMouse({ x: p5.mouseX, y: p5.mouseY });
    // };
    // p5.touchStarted = (event: TouchEvent) => {
    //   console.log("touchStarted");
    //   event.preventDefault();
    //   setDragging(true);
    //   setLastMouse({ x: p5.mouseX, y: p5.mouseY });
    // };

    // p5.mouseReleased = () => {
    //   setDragging(false);
    // };
    // p5.touchEnded = (event: TouchEvent) => {
    //   console.log("touchEnded");
    //   event.preventDefault();
    //   if (dragging) {
    //     const dx = p5.mouseX - lastMouse.x;
    //     const dy = p5.mouseY - lastMouse.y;
    //     setOffset({ x: offset.x + 50, y: offset.y + 50 });
    //     setLastMouse({ x: p5.mouseX, y: p5.mouseY });
    //     p5.redraw();
    //   }

    //   setDragging(false);
    // };

    // p5.mouseDragged = (event: MouseEvent) => {
    //   event.preventDefault();
    //   console.log("dragging", dragging);
    //   if (dragging) {
    //     const dx = p5.mouseX - lastMouse.x;
    //     const dy = p5.mouseY - lastMouse.y;
    //     setOffset({ x: offset.x + 50, y: offset.y + 50 });
    //     setLastMouse({ x: p5.mouseX, y: p5.mouseY });
    //     p5.redraw();
    //   }
    // };
    // p5.touchMoved = (event: TouchEvent) => {
    //   event.preventDefault();
    //   console.log("touching", dragging);
    //   if (dragging) {
    //     const dx = p5.mouseX - lastMouse.x;
    //     const dy = p5.mouseY - lastMouse.y;
    //     setOffset({ x: offset.x + dx, y: offset.y + dy });
    //     setLastMouse({ x: p5.mouseX, y: p5.mouseY });
    //     p5.redraw();
    //   }
    // };

    p5.draw = () => {
      p5.background(0);
      // p5.stroke(231, 179, 210);
      // Apply zoom and center adjustments
      // p5.translate(p5.width / 2, p5.height / 2);
      // p5.scale(sketchState.zoom);
      // p5.translate(-sketchState.centerX, -sketchState.centerY);

      p5.stroke(231, 179, 210, 150); // Adjust color and transparency for a shiny look

      // Enable shadow
      // p5.drawingContext.shadowOffsetX = 3;
      // p5.drawingContext.shadowOffsetY = 3;
      // p5.drawingContext.shadowBlur = 10;
      // p5.drawingContext.shadowColor = "rgba(255, 255, 255, 0.5)"; // Light white shadow

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

      // let accumulatedSpacing = spacing;

      Object.keys(allPoints).forEach((key) => {
        allPoints[key].y =
          margin + allPoints[key].depth * spacing + allPoints[key].flex;

        // allPoints[key].y =
        //   margin +
        //   (allPoints[key].depth * spacing + allPoints[key].flex) *
        //     (allPoints[key].flex / allPoints[key].branchLength);
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
      const lineUsage: Record<string, number> = {};

      // Draw lines, points, and labels
      let i = 0;
      branches.forEach((branch) => {
        i++;
        let prev: { x: number; y: number } | null = null;
        branch.forEach((point) => {
          const current = allPoints[point];
          if (prev) {
            // Define control points for the Bezier curve
            // const controlX1 = (prev.x + current.x) / 2;
            // const controlY1 = prev.y;
            // const controlX2 = (prev.x + current.x) / 2;
            // const controlY2 = current.y;

            // p5.bezier(
            //   prev.x,
            //   prev.y,
            //   controlX1,
            //   controlY1,
            //   controlX2,
            //   controlY2,
            //   current.x,
            //   current.y
            // );
            p5.line(prev.x, prev.y, current.x, current.y);

            const lineKey = `${prev.x},${prev.y}-${current.x},${current.y}`;
            lineUsage[lineKey] = (lineUsage[lineKey] || 0) + 1;
            const weight = lineUsage[lineKey] > 1 ? 3 : 1;
            // p5.strokeWeight(weight); // Set the line thickness based on usage
            // p5.line(prev.x, prev.y, current.x, current.y);
          }
          p5.strokeWeight(1); // Reset the line thickness for points and text

          // Enable shadow
          p5.drawingContext.shadowOffsetX = 3;
          p5.drawingContext.shadowOffsetY = 3;
          p5.drawingContext.shadowBlur = 10;
          p5.drawingContext.shadowColor = "rgba(255, 255, 255, 0.5)"; // Light white shadow

          p5.ellipse(current.x, current.y, 2, 2);

          p5.drawingContext.shadowOffsetX = 0;
          p5.drawingContext.shadowOffsetY = 0;
          p5.drawingContext.shadowBlur = 0;
          p5.drawingContext.shadowColor = "rgba(0, 0, 0, 0)";
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
